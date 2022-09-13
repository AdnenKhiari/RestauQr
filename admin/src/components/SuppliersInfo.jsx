import {FormProvider, useFieldArray, useForm, useFormContext, useWatch} from "react-hook-form"
import {AddUpdateSupplier} from "../lib/SuppliersDal"
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
import ProductTable from "./Tables/ProductsTable"
import addimage from "../images/addimage.png"

import plusimage from "../images/plus.png"
import trashimg from "../images/trash.png"


const schema = joi.object({
    id: joi.string().optional().label('Supplier Id'),
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
const SuppliersInfo = ({defaultVals = undefined})=>{
    const {result: allunits,error: errunits,loading: unitloading} = GetUnits()
    const formOptions = useForm(/*{
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
    }*/)
    const {handleSubmit,register,setValue,watch,reset,formState : {errors}} = formOptions
    const suppliermutator = AddUpdateSupplier(!defaultVals)
    const usenav = useNavigate() 
    console.log(errors)
    const SubmitForm = async (data)=>{
        
        console.log(data)
        return;
        try{
            console.log("D",data)
            const suppid  = await suppliermutator.mutate(data)
            console.log(suppid)

            if(suppliermutator.error)
                throw suppliermutator.error
              
            // normalement usenav to the new id
            usenav(ROUTES.SUPPLIERS.GET_SUPPLIER(suppid))
            
        }catch(err){
            console.error(err)
        }
    }
    if(unitloading)
        return <Loading />
    if(errunits)
        return <Error msg={"Could Not Retrieve Units"} error={errunits} />
    return <motion.div variants={FadeIn()} className="secondary-form">
        <h1>{defaultVals ? "Update Supplier : " + defaultVals.name :"Add Supplier   " } </h1>
        <FormProvider {...formOptions}>
            <form onReset={(e)=>{e.preventDefault();reset()}} onSubmit={handleSubmit(SubmitForm)}>
            <div style={{float: "right"}} className="input-item">
                <label htmlFor='img'>
                    <p>Logo:</p>
                    <img style={{width: "500px",height: "500px"}} className={"secondary-img " + (errors.img ? 'input-error' : '')} src={(watch('img') && (typeof(watch('img')) === 'string' ? watch('img') :  URL.createObjectURL(new Blob(watch('img'))) )   ) || addimage }  alt="" />
                </label>
                <input className={"secondary-input "} type="file" id='img' {...register("img")} />
            </div>  
            <div className="input-item">
                <label htmlFor="name"><h2>Name : </h2></label>
                <input placeholder="Name..." className={"secondary-input " + (errors.name ? 'input-error' : '')} type="text" id="name" {...register("name")} />
            </div>   
            <div className="input-item">
                <label htmlFor="website"><h2>Website : </h2></label>
                <input className={"secondary-input " + (errors.name ? 'input-error' : '')} type="url" id="website" {...register("website")} />
            </div>   
            <div className="input-item">
                <label htmlFor="email"><h2>Email: </h2></label>
                <input  className={"secondary-input " + (errors.sellingUnitPrice ? 'input-error' : '')} type="email" id="email" {...register("email")} />
            </div>    
            <MultipleInputs type="tel" title="Phone Numbers" name="phonenumbers" />
            <MultipleInputs  title="Addresses" name="addresses" />
            <SuppliersProducts />


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

const SuppliersProducts = ()=>{
    const usenav = useNavigate()
    const {watch} = useFormContext()
    const {append,remove} = useFieldArray({
        name: "products"
    })
    const products = watch("products")
    return <>
        <div className="input-item tickets">
            <label> <h2>Products : </h2></label>
            {products && products.map((prd,key)=>{
                return <div onClick={(e)=>{
                    window.open(ROUTES.INVENTORY.GET_REVIEW_PRODUCT(prd.id))
                }} key={key} className="ticket-item">
                    <p>{prd.name}</p>
                    <img onClick={(e)=>{
                        e.preventDefault()
                        e.stopPropagation()
                        remove(key)
                    }} className="make-img-error"  src={trashimg} alt="remove" />
                </div>
            })}
        </div>   
        <ProductTable oncl={(e)=>{
            append({name: e.name,id: e.id})
        }} />

    </>
} 

const MultipleInputs = ({name,title,type="text"})=>{
    const {watch,formState: {errors},register} = useFormContext()
    const {append,remove} = useFieldArray({name: name})
    const arr = watch(name)
    return <div className="input-item multiple">
        <label htmlFor={name}><h2> {title} : <img className="make-img-blue"  onClick={(e)=>append('')} src={plusimage} alt="add" /> </h2> </label>
        <div className="items">
        {arr && arr.length > 0 && arr.map((it,key)=>{
            return <div key={key}>
                    <input className={"secondary-input " + (errors[name] ? 'input-error' : '')} type={type} id={name} {...register(`${name}.${key}`)} />
                    <img onClick={(e)=>remove(key)} className="make-img-error" src={trashimg} alt="remove" />
                </div>
        })}
        </div>
    </div>  
}
export default SuppliersInfo