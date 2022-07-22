import {FormProvider, useFieldArray, useForm, useFormContext} from "react-hook-form"
import {AddUpdateProductOrder} from "../lib/ProductsDal"
import {useNavigate, useParams} from "react-router-dom"
import * as ROUTES from "../ROUTES"
import DropDown from "react-dropdown"
import{joiResolver} from "@hookform/resolvers/joi"
import joi from "joi"
import Loading from "./Loading"
import Error from "./Error"
import { FadeIn } from "../animations"
import {motion} from "framer-motion"


const schema = joi.object({
    id: joi.string().optional().label('Item Id'),
    name: joi.string().required().label('Item Name'),
    productQuantity: joi.number().min(0).required().label('Item Quantity :'),
    unitQuantity: joi.number().min(0).required().label('Quantity/U'),
    unitPrice: joi.number().min(0).required().label('Price/U'),
    time: joi.date().required().label('Time'),
    expiresIn: joi.date().required().label('Expires In'),
    used: joi.number().min(0).required().label('Wasted'),
    wasted: joi.number().min(0).required().label('Used')
})
const ProductOrdersDetails = ({defaultVals = undefined,productid})=>{
    const formOptions = useForm({
        defaultValues: defaultVals || {
            used: 0,
            wasted: 0
        },
        resolver: joiResolver(schema)
    })
    const {handleSubmit,register,setValue,watch,reset,formState : {errors}} = formOptions
    const productordermutator = AddUpdateProductOrder(productid)
    const usenav = useNavigate() 
    console.log(errors)
    const SubmitForm = async (data)=>{
        
        try{
            console.log("D",data)
            /*
            const productorderid  = await productordermutator.mutate(data)
            console.log(productorderid)

            if(productordermutator.error)
                throw productordermutator.error
              
            // normalement usenav to the new id
            usenav(ROUTES.INVENTORY.GET_REVIEW_PRODUCT_ORDER(productid,productorderid))
            */
        }catch(err){
            console.error(err)
        }
    }
  
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
                <input placeholder="0" className={"secondary-input " + (errors.productQuantity ? 'input-error' : '')} type="number" id="productQuantity" {...register("productQuantity")} />
            </div>    
            <div className="input-item">
                <label htmlFor="unitQuantity"><h2>Quantity/U : </h2></label>
                <input placeholder="0" className={"secondary-input " + (errors.unitQuantity ? 'input-error' : '')} type="number" id="unitQuantity" {...register("unitQuantity")} />
            </div>    
            <div className="input-item">
                <label htmlFor="unitPrice"><h2>Price/U : </h2></label>
                <input placeholder="0" className={"secondary-input " + (errors.unitPrice ? 'input-error' : '')} type="number" id="unitPrice" {...register("unitPrice")} />
            </div>   
            <div className="input-item">
                <label htmlFor="used"><h2>Used : </h2></label>
                <input placeholder="0" className={"secondary-input " + (errors.used ? 'input-error' : '')} type="number" id="used" {...register("used")} />
            </div>    
            <div className="input-item">
                <label htmlFor="unitQuantity"><h2>Wasted : </h2></label>
                <input placeholder="0" className={"secondary-input " + (errors.wasted ? 'input-error' : '')} type="number" id="wasted" {...register("wasted")} />
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
            {errors["used"] && <p className="error">{errors["used"].message.replaceAll('"','') }</p>}
            {errors["wasted"] && <p className="error">{errors["wasted"].message.replaceAll('"','') }</p>}
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
export default ProductOrdersDetails