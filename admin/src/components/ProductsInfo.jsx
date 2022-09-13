import {FormProvider, useFieldArray, useForm, useFormContext, useWatch} from "react-hook-form"
import {AddUpdateProduct} from "../lib/ProductsDal"
import {GetUnits} from "../lib/Units"
import {useNavigate} from "react-router-dom"
import * as ROUTES from "../ROUTES"
import DropDown from "react-dropdown"
import{joiResolver} from "@hookform/resolvers/joi"
import joi from "joi"
import Loading from "./Loading"
import Error from "./Error"
import { FadeIn } from "../animations"
import {motion} from "framer-motion"
import Select from "react-select"
import { useEffect } from "react"
import CustomSelect from "./Custom/CustomSelect"
import FormSelect from "./Custom/FormSelect"

import UnitSelect from "./Custom/UnitSelect"

const schema = joi.object({
    id: joi.string().optional().label('Product Id'),
    name: joi.string().required().label('Product Name'),
    sellingUnitPrice: joi.number().min(0).required().label('Price/U:'),
    unitQuantity: joi.number().min(0).required().label('Quantity/U'),
    unit : joi.object({
        id: joi.string().optional(),
        name: joi.string().required().label("Unit Name"),
        subunit: joi.object({
            name: joi.string().required(),
            ratio: joi.number().required()
        }).optional()
    }).required()
})
const ProductsDetails = ({defaultVals = undefined})=>{
    const {result: allunits,error: errunits,loading: unitloading} = GetUnits()
    const formOptions = useForm({
        defaultValues: defaultVals ? {
            unit: defaultVals.unit,
            unitQuantity: defaultVals.unitQuantity / (defaultVals.unit.subunit ? defaultVals.unit.subunit.ratio : 1 ),
            sellingUnitPrice: defaultVals.sellingUnitPrice,
            name: defaultVals.name,
            id: defaultVals.id
        } : {
            unit: '',
            unitQuantity: 0,
            sellingUnitPrice: 0,
            name: ''
        },
        resolver: joiResolver(schema)
    })
    const {handleSubmit,register,setValue,watch,reset,formState : {errors}} = formOptions
    const productmutator = AddUpdateProduct(!defaultVals)
    const usenav = useNavigate() 
    console.log(errors)
    const SubmitForm = async (data)=>{
        
        try{
            console.log("D",data)
            const productid  = await productmutator.mutate(data)
            console.log(productid)

            if(productmutator.error)
                throw productmutator.error
              
            // normalement usenav to the new id
            usenav(ROUTES.INVENTORY.GET_REVIEW_PRODUCT(productid))
            
        }catch(err){
            console.error(err)
        }
    }

    const chosenunit = watch("unit")
    const frm = watch()
    console.log(frm)
    useEffect(()=>{
       // register("unit")
    },[])
    if(unitloading)
        return <Loading />
    if(errunits)
        return <Error msg={"Could Not Retrieve Units"} error={errunits} />
    return <motion.div variants={FadeIn()} className="secondary-form">
        <h1>{defaultVals ? "Update Product : " + defaultVals.name :"Add Product" } </h1>
        <FormProvider {...formOptions}>
            <form onReset={(e)=>{e.preventDefault();reset()}} onSubmit={handleSubmit(SubmitForm)}>
            <div className="input-item">
                <label htmlFor="name"><h2>Name : </h2></label>
                <input placeholder="Name..." className={"secondary-input " + (errors.name ? 'input-error' : '')} type="text" id="name" {...register("name")} />
            </div>            
            <div className="input-item">
                <label htmlFor="sellingUnitPrice"><h2>Price/U: </h2></label>
                <input placeholder="0" className={"secondary-input " + (errors.sellingUnitPrice ? 'input-error' : '')} type="number" id="sellingUnitPrice" {...register("sellingUnitPrice")} />
            </div>    
            <div className="input-item">
                <label htmlFor="unitQuantity"><h2>Quantity/U : </h2></label>
                <input placeholder="0" className={"secondary-input " + (errors.unitQuantity ? 'input-error' : '')} type="number" id="unitQuantity" {...register("unitQuantity")} />
                <p>{chosenunit.subunit ? chosenunit.subunit.name : chosenunit.name }</p>

            </div>    
            {/*<div className="input-item">
                <label htmlFor="unit"><h2>Unit : </h2></label>
                <input className={"secondary-input " + (errors.unit ? 'input-error' : '')} type="text" id="unit" {...register("unit")} />
            </div> */  }
            <div className="input-item">
                <label htmlFor="unit"><h2>Unit : </h2></label>
                <UnitSelect defaultValue={defaultVals ? defaultVals.unit : ""} name="unit" units={allunits} />                
            </div>  
            {errors["id"] && <p className="error">{errors["id"].message.replaceAll('"','') }</p>}
            {errors["name"] && <p className="error">{errors["name"].message.replaceAll('"','') }</p>}
            {errors["unit"] && <p className="error">{"Invalid Unit"}</p>}
            {errors["sellingUnitPrice"] && <p className="error">{errors["sellingUnitPrice"].message.replaceAll('"','') }</p>}
            {errors["unitQuantity"] && <p className="error">{errors["unitQuantity"].message.replaceAll('"','') }</p>}

            <div className="validate">
                <button type={"reset"}>Reset</button>
                <button type="submit">{defaultVals ? "Update" : "Add"}</button>
            </div>
            </form>
        </FormProvider>
    </motion.div>
}
export default ProductsDetails