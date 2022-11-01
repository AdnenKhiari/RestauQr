import {FormProvider, useFieldArray, useForm, useFormContext} from "react-hook-form"
import {AddUpdateMerchandise, GetProductById} from "../lib/ProductsDal"
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
import FormSelect from "./Custom/FormSelect"


const getSchemaOfCustomFields = (custom_fields)=>{
    const arr = {
        id: joi.string().optional().label('Item Id'),
        name: joi.string().required().label('Item Name'),
        productQuantity: joi.number().min(0).required().label('Item Quantity :'),
        unitQuantity: unitvalueschema.required().label('Quantity/U'),
        unitPrice: joi.number().min(0).required().label('Price/U'),
        expiresIn: joi.date().required().label('Expires In'),
    }
    custom_fields.forEach((key)=>{
        if(key.type === "short-text")
            arr[key.name] = joi.string().allow("").required().label(key.label)
        if(key.type === "long-text")
            arr[key.name] = joi.string().allow("").required().label(key.label)
        if(key.type === "decimal")
            arr[key.name] = joi.number().allow("").required().label(key.label)
        if(key.type === "date")
            arr[key.name] = joi.date().allow("").required().label(key.label)
        if(key.type === "date-time")
            arr[key.name] =joi.date().allow("").required().label(key.label)
        if(key.type === "select")
            arr[key.name] =joi.string().valid(...key.choices,"").required().label(key.label)
        if(key.type === "list-select")
            arr[key.name] =joi.array().items(joi.string().valid(...key.choices).optional()).required().label(key.label)
    })
    return  joi.object(arr)
}

const MerchandiseDetails = ({defaultVals = undefined,productid,submit})=>{

    const {result: product,error: producterr,loading: loadingerr} = GetProductById(productid)
    const {result: allunits,error: errorunits,loading: loadingunits} = GetUnits()
    const productordermutator = AddUpdateMerchandise(productid,!defaultVals)

    const usenav = useNavigate() 
    const getDefaultVals = ()=>{
        const ob = defaultVals ? {
            id: defaultVals.id,
            name: defaultVals.name,
            unitQuantity : defaultVals.unitQuantity,
            productQuantity: defaultVals.productQuantity,
            unitPrice: defaultVals.unitPrice,
            expiresIn: formatFbDate(defaultVals?.expiresIn,true),
        }  : undefined
        defaultVals && product.template?.custom_fields?.forEach((key)=>{
            if(key.type === "date")
                ob[key.name] = formatFbDate(defaultVals[key.name],true)
            else if(key.type ==="date-time")
                ob[key.name] = formatFbDate(defaultVals[key.name],false,true)
            else ob[key.name] = defaultVals[key.name]
        })
        return ob
    }
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
    //console.log("CSL",product,producterr,loadingerr)
    return <MechandiseUi onSubmit={submit ? submit : SubmitForm} allunits={allunits} product={product} defaultVals={getDefaultVals()} />
}

const MechandiseUi = ({defaultVals,product,allunits,onSubmit})=>{
    const schema =getSchemaOfCustomFields(product.template?.custom_fields  || [])

    const formOptions = useForm({
        defaultValues: defaultVals,
        resolver: joiResolver(schema)
    })
    const {handleSubmit,register,setValue,watch,reset,control,formState : {errors}} = formOptions
    console.log(errors,watch())
    
    return <motion.div variants={FadeIn()} className="secondary-form">
        
        <FormProvider {...formOptions}>
            <form onReset={(e)=>{e.preventDefault();reset()}} onSubmit={handleSubmit(onSubmit)}>
            <h1>{defaultVals ? "Update Item : " + defaultVals.name :"Add Item" } </h1>

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
                          customunits={[{...product.unit,customUnits: product.customUnits || []}]}
                          defaultValue={{value:  defaultVals ? defaultVals.unitQuantity : 0,units: product.unit}} 
                          units={allunits.filter((un)=>un.id === product.unit.id)} />    
                </div>    
            <div className="input-item">
                <label htmlFor="unitPrice"><h2>Price/U : </h2></label>
                <input  className={"secondary-input " + (errors.unitPrice ? 'input-error' : '')} type="number" id="unitPrice" {...register("unitPrice")} />
            </div>   
            <div className="input-item">
                <label htmlFor="expiresIn"><h2>Expires In : </h2></label>
                <input className={"secondary-input " + (errors.expiresIn ? 'input-error' : '')} type="date" id="expiresIn" {...register("expiresIn")} />
            </div>    
            {product.template?.custom_fields.map((cst,key)=>{
                return <>
                <div key={key} className="input-item">
                    <label htmlFor={cst.name}><h2>{cst.label} : </h2></label>
                    {(cst.type === "short-text" || cst.type === "date-time" || cst.type === "date"  ||  cst.type === "decimal" ) && <input  className={"secondary-input " + (errors[cst.name] ? 'input-error' : '')} 
                    step={cst.type === "decimal" ? 0.00001  : undefined}
                    type={(
                        cst.type === "date" ? "date"  : cst.type === "date-time" ? "datetime-local" : (cst.type === "decimal") ? "number" : "text"
                    )} id={cst.name} 
                    {...register(cst.name)} />}
            
                    
                    {cst.type === "select" && (
                        <FormSelect options={cst.choices.map((item)=>({value: item,label: item}))} defaultValue={defaultVals && defaultVals[cst.name] && {label:defaultVals[cst.name],value: defaultVals[cst.name]}} name={cst.name} control={control} />
                    )
                    }
                   
                    {cst.type === "list-select" && (
                        <FormSelect isMulti options={cst.choices.map((item)=>({value: item,label: item}))} defaultValue={defaultVals && defaultVals[cst.name] ? defaultVals[cst.name].map((k)=>({label: k,value: k})) : []} name={cst.name} control={control} />  
                    )}
                </div> 
                {(cst.type === "long-text") && <textarea 
                    key={key+100} 
                    rows={20}
                    cols={20}
                    className={(errors[cst.name] ? 'input-error' : '')} 
                    id={cst.name} 
                    {...register(cst.name)} />}
                
                </>
            }) 
            }

            {errors["name"] && <p className="error">{errors["name"].message.replaceAll('"','') }</p>}
            {errors["productQuantity"] && <p className="error">{errors["productQuantity"].message.replaceAll('"','') }</p>}
            {errors["unitPrice"] && <p className="error">{errors["unitPrice"].message.replaceAll('"','') }</p>}
            {errors["unitQuantity"] && <p className="error">{errors["unitQuantity"].message.replaceAll('"','') }</p>}
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