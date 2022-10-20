import {FormProvider, useFieldArray, useForm, useFormContext, useWatch} from "react-hook-form"
import {AddUpdateProductTemplate} from "../lib/ProductTemplates"
import {GetUnits} from "../lib/Units"
import {useNavigate, useParams} from "react-router-dom"
import * as ROUTES from "../ROUTES"
import DropDown from "react-dropdown"
import{joiResolver} from "@hookform/resolvers/joi"
import joi from "joi"
import Loading from "./Loading"
import Error from "./Error"
import { FadeIn } from "../animations"
import {motion} from "framer-motion"
import Select from "react-select"
import PopupItem from "../components/PopupItem"
import { useEffect, useState } from "react"
import CustomSelect from "./Custom/CustomSelect"
import FormSelect from "./Custom/FormSelect"
import plusimg from "../images/plus.png"
import trashimg from "../images/trash.png"
import calendarimg from "../images/calendar.png"
import datetimeimg from "../images/datetime.png"
import notesimg from "../images/notes.png"
import textinputimg from "../images/text-input.png"
import integerimg from "../images/numeric.png"
import decimalimg from "../images/decimal.png"


import { v4 as uuidv4 } from 'uuid';


const schema = joi.object({
    id: joi.string().optional().label('Product Template Id'),
    name: joi.string().required().label('Product Template Name'),
    notes: joi.string().required().label('Product Template Notes'),
    custom_fields : joi.array().items(
        joi.object({
            id: joi.string().optional(),
            label: joi.string().required().label("Label"),
            name: joi.string().required().label("Name"),
            type: joi.string().valid("numeric","integer","short-text","long-text","date","date-time").required().label("Type"),
        }).required()
    ).required()
})
const ProductTemplateDetails = ({defaultVals = undefined})=>{
    const formOptions = useForm({
        defaultValues: defaultVals ? {
            custom_fields: defaultVals.custom_fields,
            name: defaultVals.name,
            notes: defaultVals.notes,
            id: defaultVals.id
        } : {
            notes: '',
            custom_fields: [],
            name: ''
        },
        resolver: joiResolver(schema)
    })
    const {productid} = useParams()
    const {handleSubmit,control,register,setValue,watch,reset,formState : {errors}} = formOptions
    const templatemutator = AddUpdateProductTemplate( productid,!defaultVals)
    const usenav = useNavigate() 
    console.log(errors)
    const SubmitForm = async (data)=>{
        
        try{
            console.log("D",data)
            return;
            const tempid  = await templatemutator.mutate(data)
            console.log(tempid)

            if(templatemutator.error)
                throw templatemutator.error
              
            // normalement usenav to the new id
            usenav(ROUTES.INVENTORY.GET_REVIEW_PRODUCT(productid))
            
        }catch(err){
            console.error(err)
        }
    }
    const {append,remove} = useFieldArray({
        name: "custom_fields",
        control: control
    })
    const [addFieldOpen,setAddFieldOpen] = useState(false)
    const custom_fields = watch("custom_fields")
    console.log(watch())
    return <motion.div variants={FadeIn()} className="secondary-form">
        <PopupItem open={addFieldOpen} onClose={(e)=>setAddFieldOpen(false)}>
            <NewFieldDetails append={append} />
        </PopupItem>
        <h1>{defaultVals ? "Update Product Template : " + defaultVals.name :"Add Product Template" }</h1>
        <FormProvider {...formOptions}>
            <form onReset={(e)=>{e.preventDefault();reset()}} onSubmit={handleSubmit(SubmitForm)}>
            <button type="button" 
            style={{color: "white",float: "right"}}
            onClick={(e)=>{setAddFieldOpen(true)}}
            >New Field</button>
            <div className="input-item">
                <label htmlFor="name"><h2>Name : </h2></label>
                <input placeholder="Name..." className={"secondary-input " + (errors.name ? 'input-error' : '')} type="text" id="name" {...register("name")} />
            </div>      
            <div className="input-item">
                <label htmlFor="notes"><h2>Notes : </h2></label>
            </div>     
            <textarea cols="30" rows="3" className={(errors.name ? 'input-error' : '')} type="text" id="notes" {...register("notes")}></textarea>
            <div className="split-two">
                <div>
                <div className="input-item">
                    <label><h2>Custom Fields : </h2></label>
                </div>     
                    {custom_fields && custom_fields.map((item,key)=>{
                        return <CustomLabelInput remove={remove} data={item} idx={ key} key={key} />
                    })}
                </div>
                <div className="template-preview">
                    <div className="input-item">
                        <label ><h2>Preview : </h2></label>
                    </div>  
                    {custom_fields && custom_fields.map((item,key)=>{
                        return <CustomInput remove={remove} data={item} idx={ key} key={key} />
                    })}
                </div>
            </div>
            
            {errors["id"] && <p className="error">{errors["id"].message.replaceAll('"','') }</p>}
            {errors["name"] && <p className="error">{errors["name"].message.replaceAll('"','') }</p>}
            {errors["notes"] && <p className="error">{errors["notes"].message.replaceAll('"','') }</p>}
            {errors["custom_fields"] && <p className="error">{errors["custom_fields"].message.replaceAll('"','') }</p>}

            <div className="validate">
                <button type={"reset"}>Reset</button>
                <button type="submit">{defaultVals ? "Update" : "Add"}</button>
            </div>
            </form>
        </FormProvider>
    </motion.div>
}
const getImg = (txt)=>{
    switch(txt){
        case "short-text":
            return textinputimg
        case "long-text":
            return notesimg
        case "date":
            return calendarimg
        case "date-time":
            return datetimeimg
        case "integer":
            return integerimg
        case "decimal":
            return decimalimg
        default:
            return ""
    }
}

const CustomLabelInput = ({data,idx,remove})=>{
    const {formState : {errors},register}  = useFormContext()
    return <div className="input-item">
                <img className="make-img-blue" style={{width: "70px",marginRight: "10px"}} src={getImg(data.type)} alt="" />
                <input placeholder={data.label+"..."} className={"secondary-input " + (errors.custom_fields ? 'input-error' : '')} type="text" id={data.name} {...register(`custom_fields.${idx}.label`)} />
                <img src={trashimg} className={"make-img-error"} style={{cursor: "pointer",width: "40px"}} onClick={(e)=>remove(idx)} alt="" />
            </div>          
}

const CustomInput = ({data,idx})=>{
    return <div className="custom-input">
        <div className="input-item">
            <label htmlFor={data.name}><h2>{data.label ? data.label +" :" : "Add A Name"}  </h2></label>
            {data.type === "short-text" && 
                <input placeholder={data.label + "..."} className={"secondary-input "} type="text" id={data.name}/>
            }
            {data.type === "decimal" && 
                <input  className={"secondary-input "} step="0.0001" type="number" id={data.name}/>
            }
            {data.type === "integer" && 
                <input  className={"secondary-input "} step="1" type="number" id={data.name}/>
            }
            {data.type === "date" && 
                <input  placeholder={data.label + "..."} className={"secondary-input "} type="date" id={data.name}/>
            }           
            {data.type === "date-time" && 
                <input  placeholder={data.label + "..."} className={"secondary-input "} type="datetime-local" id={data.name}/>
            }
        </div>      
        {data.type === "long-text" && 
            <textarea cols="3" rows="3" type="text" id={data.name}></textarea>
        }    
    </div>
}

const FieldChoice = ({label,img,desc,onclick})=>{
    return <div className="choice" onClick={onclick}>
        <img className="make-img-blue" src={img} alt="Field Img" />
        <div>
            <h3>{label}</h3>
            <p>{desc}</p>
        </div>
    </div>  
}
const NewFieldDetails = ({append})=>{
    return <motion.div variants={FadeIn()} className="template-multiple-choices">
        <h1>Add A New Field</h1>
        <div >
            <FieldChoice 
            label="Short Text" 
            desc={"A Short Text Input for about 100 chars"}
            img={textinputimg}
            onclick={(e)=>{
                const id = uuidv4();
                append({
                    id: id,
                    label: "",
                    name: "c-" + id,
                    type: "short-text"
                })
            }}
             />
            <FieldChoice 
            label="Long Text" 
            desc={"A Long Text Input for about 1000 chars"}
            img={notesimg}
            onclick={(e)=>{
                const id = uuidv4();
                append({
                    id: id,
                    label: "",
                    name: "c-" + id,
                    type: "long-text"
                })
            }}
             />
            <FieldChoice 
            label="Date" 
            desc={"A Date Input"}
            img={calendarimg}
            onclick={(e)=>{
                const id = uuidv4();
                append({
                    id: id,
                    label: "",
                    name: "c-" + id,
                    type: "date"
                })
            }}
             />
            <FieldChoice 
            label="Date Time" 
            desc={"A Date Time Input"}
            img={datetimeimg}
            onclick={(e)=>{
                const id = uuidv4();
                append({
                    id: id,
                    label: "",
                    name: "c-" + id,
                    type: "date-time"
                })
            }}
             />
            <FieldChoice 
            label="Integer" 
            desc={"A Signed Integer"}
            img={decimalimg}
            onclick={(e)=>{
                const id = uuidv4();
                append({
                    id: id,
                    label: "",
                    name: "c-" + id,
                    type: "integer"
                })
            }}
             />
            <FieldChoice 
            label="Numeric" 
            desc={"A Decimal Number"}
            img={integerimg}
            onclick={(e)=>{
                const id = uuidv4();
                append({
                    id: id,
                    label: "",
                    name: "c-" + id,
                    type: "decimal"
                })
            }}
             />
        </div>
    </motion.div>
}

export default ProductTemplateDetails