import {FormProvider, useFieldArray, useForm, useFormContext} from "react-hook-form"
import UploadFile from "../lib/UploadFile"
import {AddUpdateFood} from "../lib/FoodDal"
import {useNavigate} from "react-router-dom"
import * as ROUTES from "../ROUTES"
import DropDown from "react-dropdown"
import{joiResolver} from "@hookform/resolvers/joi"
import joi from "joi"
import {GetCategories} from "../lib/Options"
import Loading from "./Loading"
import Error from "./Error"
import { FadeIn } from "../animations"
import {motion} from "framer-motion"

const check_schema = joi.object({
    msg: joi.string().required().label('Item Message'),
    type: joi.allow('check').required(),
    price: joi.number().min(0).required().label('Item Price'),
}).optional()
const select_schema = joi.object({
    msg: joi.string().required().label('Item Message'),
    type: joi.allow('select').required(),
    choices: joi.array().optional().items(joi.object({
        msg: joi.string().required().label('Item Selection Message'),
        price: joi.number().min(0).label('Item Selection Price')
    }))
}).optional()
const schema = joi.object({
    id: joi.string().optional().label('ID'),
    title: joi.string().required().label('Food Name'),
    description: joi.string().required().label('Food Description'),
    category: joi.string().required().label('Food Category'),
    img: joi.any().required().label('Food Image'),
    price: joi.number().min(0).required().label('Food Price'),
    options: joi.array().optional().items(check_schema,select_schema)
})
const FoodDetails = ({defaultVals = undefined})=>{
    const formOptions = useForm({
        defaultValues: defaultVals || {
            title: '',
            img: null,
            description: '',
            category: '',
            options: []
        },
        resolver: joiResolver(schema)
    })
    const {handleSubmit,register,setValue,watch,reset,formState : {errors}} = formOptions
    const uploader = UploadFile()
    const food_uploader = AddUpdateFood()
    const usenav = useNavigate() 
    const {result : categories,loading: categoriesLoading,error : errorCategories} = GetCategories()

    const SubmitForm = async (data)=>{
        
        try{
            console.log(data)
        if( typeof(data.img) !== 'string'){
            //file upload
            if(data.img.length !==1)
                return
            
            const url = await uploader.upload(new Blob(data.img),data.img[0].type)
            data.img = url
         }
        const food_id  =await food_uploader.mutate(data)
        console.log(food_uploader,food_id)

        if(food_uploader.error)
            throw food_uploader.error

        // normalement usenav to the new id
        usenav(ROUTES.FOOD.GET_REVIEW(food_id))
        }catch(err){
            console.error(err)
        }
    }
    console.log(errors)
    if(categoriesLoading)
        return <Loading />
    if(errorCategories)
        return <Error error={errorCategories} msg={"Could Not Retrieve the categories"} />
    return <motion.div variants={FadeIn()} className="secondary-form">
        <h1>{defaultVals ? "Update Food : " + defaultVals.id :"Add Food" } </h1>
        <FormProvider {...formOptions}>
        <form onReset={(e)=>{e.preventDefault();reset()}}  onSubmit={handleSubmit(SubmitForm)}>
        <div className="input-item">
        <label htmlFor="title"><h2>Name : </h2></label>
            <input  placeholder="Name" className={"secondary-input " + (errors.title ? 'input-error' : '')} type="text" id="title" {...register('title')} />
        </div>
        <label htmlFor='img'>
            <img className={"secondary-img " + (errors.img ? 'input-error' : '')} src={(watch('img') && (typeof(watch('img')) === 'string' ? watch('img') :  URL.createObjectURL(new Blob(watch('img'))) )   ) || "/addimage.png" }  alt="" />
        </label>
        <input className={"secondary-input "} type="file" id='img' {...register("img")} />
        <label htmlFor="description"><h2>Description : </h2></label>
        <textarea className={(errors.description ? 'input-error' : '')} placeholder="Description Here ..." id="description" cols="30" rows="10"{...register("description")}></textarea>
        <div className="input-item">
            <label htmlFor="price"><h2>Price : </h2></label>
            <input placeholder="0" className={"secondary-input " + (errors.price ? 'input-error' : '')} type="number" id="price" {...register("price")} />
        </div>        
        <div className="input-item flex-start">
            <label htmlFor="category"><h2>Category  </h2></label>
            <DropDown options={categories} 
            name="category" 
            value={watch('category')} 
            onChange={(d)=>setValue('category',d.value)} 
            arrowOpen={<img alt="open" src="/next.png" />}
            arrowClosed={<img alt="open" src="/back.png" />}
            />
        </div>        
        <Options/>
        {errors["title"] && <p className="error">{errors["title"].message.replaceAll('"','') }</p>}
        {errors["description"] && <p className="error">{errors["description"].message.replaceAll('"','') }</p>}
        {errors["price"] && <p className="error">{errors["price"].message.replaceAll('"','') }</p>}
        {(!watch('category') || true)  && errors["category"] && <p className="error">{errors["category"].message.replaceAll('"','') }</p>}
        {errors["img"] && <p className="error">Select a valid image</p>}
        {errors["options"] && <p className="error">Errors on option inputs</p>}

        <div className="validate">
            <button type={"reset"}>Reset</button>
            <button type="submit">{defaultVals ? "Update" : "Add"}</button>
        </div>
        </form>
        </FormProvider>
    </motion.div>
}
const Options = ()=>{

    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
        name: "options", // unique name for your Field Array
    });

    const {watch,setValue,register} = useFormContext()
    return  <div className="options-list">
        <div className="options-list-header">
            <h2>Options : </h2>
            <h3><button onClick={(e)=>{
                const leng = watch('options') ? watch('options').length : 0
                setValue(`options.${leng}`,{type: 'check',msg: '',price: 0})
            }}>Add Check Item</button></h3>
                    <h3><button onClick={(e)=>{
                const leng = watch('options') ? watch('options').length : 0
                setValue(`options.${leng}`,{type: 'select',msg: '',choices: []})
            }}>Add Multiple Select Item</button></h3>  

        </div>

        <div className="options-types">
        {watch("options") && watch("options").map((opt,index)=>{
            if(opt.type === 'check')
                return <div key={index} className="check-item">
                    <img className="make-img-blue" src="/checkbox.png" alt="Option" />
                    <input placeholder="Message..." className="secondary-input" type="text" {...register(`options.${index}.msg`)} />
                    <input placeholder="0" className="secondary-input"  type="number" {...register(`options.${index}.price`)} />
                    <img  className="remove-img make-img-error" src="/trash.png" alt="Option" onClick={(e)=>{
                        remove(index)
                    }} />
                </div>
            return <MultipleChoiceItem removeItem={remove} idx={index} key={index} />
        })
        }
        </div>
    </div>
}
const MultipleChoiceItem = ({idx,removeItem})=>{
    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
        name: `options.${idx}.choices`, // unique name for your Field Array
    });
    const {register,setValue,watch} = useFormContext()

    return <div className="select-item">
        <div className="select-header">
            <img className="make-img-blue" src="/radio-button.png" alt="Option" />
                <input  placeholder="Message..." className="secondary-input"  type="text" {...register(`options.${idx}.msg`)} />
                <img className="add-img make-img-green" src="/plus.png" alt="Add Choice" onClick={(e)=>{
                append({msg: '',price: ''})
                }} />
                <img className="remove-img make-img-error" src="/trash.png" alt="Option" onClick={(e)=>{
                        removeItem(idx)
                }} />
        </div>

        <div className="choices">
            {watch(`options.${idx}.choices`) && watch(`options.${idx}.choices`).map((choice,index)=><div className="choice-item"  key={index}>
                <img className="make-img-blue" src="/radio.png" alt="radio" />
                <input placeholder="Message..." className="secondary-input"  type="text" {...register(`options.${idx}.choices.${index}.msg`)} />
                <input placeholder="0" className="secondary-input"  type="number" {...register(`options.${idx}.choices.${index}.price`)} />
                <img className="remove-img make-img-error" src="/trash.png" alt="Option" onClick={(e)=>{
                        remove(index)
                }} />
            </div>)
            }
            </div>
        </div>
}
export default FoodDetails