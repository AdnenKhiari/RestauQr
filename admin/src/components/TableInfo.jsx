import {FormProvider, useFieldArray, useForm, useFormContext} from "react-hook-form"
import {AddUpdateTable} from "../lib/TablesDal"
import {useNavigate} from "react-router-dom"
import * as ROUTES from "../ROUTES"
import DropDown from "react-dropdown"
import{joiResolver} from "@hookform/resolvers/joi"
import joi from "joi"
import {GetCategories} from "../lib/Categories"
import Loading from "./Loading"
import Error from "./Error"
import { FadeIn } from "../animations"
import {motion} from "framer-motion"


import checkboximg from "../images/checkbox.png"

const schema = joi.object({
    id: joi.string().required().label('Table Id'),
    placesNum: joi.number().min(1).required().label('Table Capacity'),
    disabled: joi.bool().required().label('Disabled'),
    time: joi.date().required().label('Pushase Date')
})
const TableDetails = ({defaultVals = undefined})=>{
    const formOptions = useForm({
        defaultValues: defaultVals || {
            disabled: false,
            placesNum: null,
            time: '',
            id: ''
        },
        resolver: joiResolver(schema)
    })
    console.log(defaultVals)
    const {handleSubmit,register,setValue,watch,reset,formState : {errors}} = formOptions
    const tablemutator = AddUpdateTable(!defaultVals)
    const usenav = useNavigate() 

    const SubmitForm = async (data)=>{
        
        try{
            console.log(data)
            const table_id  = await tablemutator.mutate(data)
            console.log(table_id)

            if(tablemutator.error)
                throw tablemutator.error

            // normalement usenav to the new id
            usenav(ROUTES.TABLES.GET_REVIEW(table_id))
            
        }catch(err){
            console.error(err)
        }
    }
  
    return <motion.div variants={FadeIn()} className="secondary-form">
        <h1>{defaultVals ? "Update Table : " + defaultVals.id :"Add Table" } </h1>
        <FormProvider {...formOptions}>
            <form onReset={(e)=>{e.preventDefault();reset()}} onSubmit={handleSubmit(SubmitForm)}>
            { !defaultVals &&  <div className="input-item">
                <label htmlFor="id"><h2>Table Number : </h2></label>
                <input className={"secondary-input " + (errors.id ? 'input-error' : '')} type="number" id="id" {...register("id")} />
            </div>   } 
            <div className="input-item">
                <label htmlFor="placesNum"><h2>Table Capacity : </h2></label>
                <input placeholder="1" className={"secondary-input " + (errors.placesNum ? 'input-error' : '')} type="number" id="placesNum" {...register("placesNum")} />
            </div>        
            <div className="input-item">
                <label htmlFor="disabled"><h2>Is Disabled  :</h2></label>
                <img className={(watch('disabled') && "make-img-blue ") + " small "  + (errors.price ? 'make-img-error' : '')}  onClick={(e)=>setValue("disabled",!watch("disabled"))}  src={checkboximg} alt="disabled" />
                <input className={"secondary-input " + (errors.disabled ? 'input-error' : '')} type="checkbox" id="disabled" {...register("disabled")} />
            </div>       
            <div className="input-item">
                <label htmlFor="time"><h2>Purshase Date : </h2></label>
                <input className={"secondary-input " + (errors.time ? 'input-error' : '')} type="date" id="time" {...register("time")} />
            </div>    
            {errors["disabled"] && <p className="error">{errors["disabled"].message.replaceAll('"','') }</p>}
            {errors["placesNum"] && <p className="error">{errors["placesNum"].message.replaceAll('"','') }</p>}
            {errors["id"] && <p className="error">{errors["id"].message.replaceAll('"','') }</p>}
            {errors["time"] && <p className="error">{errors["time"].message.replaceAll('"','') }</p>}

            <div className="validate">
                <button type={"reset"}>Reset</button>
                <button type="submit">{defaultVals ? "Update" : "Add"}</button>
            </div>
            </form>
        </FormProvider>
    </motion.div>
}
export default TableDetails