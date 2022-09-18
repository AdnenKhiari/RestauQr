import {FormProvider, useFieldArray, useForm, useFormContext} from "react-hook-form"
import {AddUpdateProductOrder, GetProductById} from "../lib/ProductsDal"
import {useNavigate, useParams} from "react-router-dom"
import * as ROUTES from "../ROUTES"
import DropDown from "react-dropdown"
import{joiResolver} from "@hookform/resolvers/joi"
import joi from "joi"
import Loading from "./Loading"
import Error from "./Error"
import { FadeIn } from "../animations"
import {formatFbDate} from "../lib/utils"
import {motion} from "framer-motion"
import UnitValue,{unitvalueschema} from "./Custom/UnitValue"
import { GetUnits } from "../lib/Units"

const schema = joi.object({
    id: joi.string().optional().label('Item Id'),
    name: joi.string().required().label('Item Name'),
    productQuantity: joi.number().min(0).required().label('Item Quantity :'),
    unitQuantity: unitvalueschema.required().label('Quantity/U'),
    unitPrice: joi.number().min(0).required().label('Price/U'),
    time: joi.date().required().label('Time'),
    expiresIn: joi.date().required().label('Expires In')
})
const MerchandiseDetails = ({defaultVals = undefined,productid})=>{
    const formOptions = useForm({
        defaultValues: defaultVals ? {
            id: defaultVals.id,
            name: defaultVals.name,
            productQuantity: defaultVals.productQuantity,
            unitPrice: defaultVals.unitPrice,
            expiresIn: formatFbDate(defaultVals.expiresIn,true),
            time:formatFbDate(defaultVals.time,true)
            } 
            : undefined,
        resolver: joiResolver(schema)
    })
    const {result: product,error: producterr,loading: loadingerr} = GetProductById(productid)
    const {result: allunits,error: errorunits,loading: loadingunits} = GetUnits()

    const {handleSubmit,register,setValue,watch,reset,control,formState : {errors}} = formOptions
    const productordermutator = AddUpdateProductOrder(productid,!defaultVals)
    const usenav = useNavigate() 
    console.log(errors)
    const SubmitForm = async (data)=>{
        try{
            data.unitQuantity = data.unitQuantity.value * (data.unitQuantity.unit?.subunit ? data.unitQuantity.unit?.subunit.ratio : 1 )
            console.log("D",data)

            const productorderid  = await productordermutator.mutate(data)
            console.log(productorderid)

            if(productordermutator.error)
                throw productordermutator.error
              
            // normalement usenav to the new id
            usenav(ROUTES.INVENTORY.GET_REVIEW_PRODUCT_MERCHANDISE(productid,productorderid))
            
        }catch(err){
            console.error(err)
        }
    }
    if(producterr || errorunits)
        return <>
            {producterr && <Error error={producterr} msg="Error while retrieving Product Information" />}
            {errorunits && <Error error={errorunits} msg="Error while retrieving Units Information" />}
        </>
    if(loadingerr|| loadingunits)
        return <Loading />
    console.log("CSL",product,producterr,loadingerr)
    return <motion.div variants={FadeIn()} className="secondary-form">
        <h1>{defaultVals ? "Update Item : " + defaultVals.name :"Add Item" } </h1>
        
        <FormProvider {...formOptions}>
            <form onReset={(e)=>{e.preventDefault();reset()}} onSubmit={handleSubmit(SubmitForm)}>
            <div className="input-item">
                <label htmlFor="name"><h2>Item Name : </h2></label>
                <input placeholder="Name..." className={"secondary-input " + (errors.name ? 'input-error' : '')} type="text" id="name" {...register("name")} />
            </div>            
            <div className="input-item">
                <label htmlFor="productQuantity"><h2>Unit Count: </h2></label>
                <input  className={"secondary-input " + (errors.productQuantity ? 'input-error' : '')} type="number" id="productQuantity" {...register("productQuantity")} />
           </div>    
            <div className="input-item">
                <label htmlFor="unitQuantity"><h2>Quantity/U : </h2></label>
                <UnitValue  inputcustomprops={{className:"secondary-input" ,id:"unitQuantity"}}
                          register={register}  
                          name="unitQuantity" 
                          control={control}     
                          defaultValue={{value:  defaultVals ? defaultVals.unitQuantity: 0,units: product.unit}} 
                          units={allunits.filter((un)=>un.id === product.unit.id)} />    
                </div>    
            <div className="input-item">
                <label htmlFor="unitPrice"><h2>Price/U : </h2></label>
                <input  className={"secondary-input " + (errors.unitPrice ? 'input-error' : '')} type="number" id="unitPrice" {...register("unitPrice")} />
            </div>   
            <div className="input-item">
                <label htmlFor="time"><h2>Purshase Time : </h2></label>
                <input  className={"secondary-input " + (errors.time ? 'input-error' : '')} type="date" id="time" {...register("time")} />
            </div>    
            <div className="input-item">
                <label htmlFor="expiresIn"><h2>Expires In : </h2></label>
                <input  className={"secondary-input " + (errors.expiresIn ? 'input-error' : '')} type="date" id="expiresIn" {...register("expiresIn")} />
            </div>    

            {errors["name"] && <p className="error">{errors["name"].message.replaceAll('"','') }</p>}
            {errors["productQuantity"] && <p className="error">{errors["productQuantity"].message.replaceAll('"','') }</p>}
            {errors["unitPrice"] && <p className="error">{errors["unitPrice"].message.replaceAll('"','') }</p>}
            {errors["unitQuantity"] && <p className="error">{errors["unitQuantity"].message.replaceAll('"','') }</p>}
            {errors["time"] && <p className="error">{errors["time"].message.replaceAll('"','') }</p>}
            {errors["expiresIn"] && <p className="error">{errors["expiresIn"].message.replaceAll('"','') }</p>}

            <div className="validate">
                <button type={"reset"}>Reset</button>
                <button type="submit">{defaultVals ? "Update" : "Add"}</button>
            </div>
            </form>
        </FormProvider>
    </motion.div>
}
export default MerchandiseDetails