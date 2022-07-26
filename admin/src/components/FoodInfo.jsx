import {FormProvider, useFieldArray, useForm, useFormContext} from "react-hook-form"
import UploadFile from "../lib/UploadFile"
import {AddUpdateFood} from "../lib/FoodDal"
import {useNavigate} from "react-router-dom"
import * as ROUTES from "../ROUTES"
import DropDown from "react-dropdown"
import{joiResolver} from "@hookform/resolvers/joi"
import joi, { options } from "joi"
import {GetCategories} from "../lib/Options"
import Loading from "./Loading"
import Error from "./Error"
import { FadeIn } from "../animations"
import {motion} from "framer-motion"
import {useTable} from "react-table"
import { useEffect, useMemo, useState } from "react"

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
            ingredients: '',
        }
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
        <Ingredients />
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
const Ingredients = ()=>{
    const [active,setActive] = useState(["ingredients"])
    const popActive = ()=>{
        active.pop()
        setActive([...active])
    }
    const pushActive = (item)=>{
        active.push(item)
        setActive([...active])
    }
    const {watch,setValue,register,reset,control} = useFormContext()
    return  <div className="ingredients-details">
        <h1>Ingredients : <small>{active && active.join('').replaceAll(".","/")}</small></h1>
        <SelectionTable popActive={popActive} root={active} />  
        <Options pushActive = {pushActive} root={active}/>
    </div>
}

const Options = ({root,pushActive})=>{
    const path =  root.join('')+".options" 

    const {watch,setValue,register,reset,control} = useFormContext()

    const ufa = useFieldArray({
        name: root.join('')+".options" ,
        shouldUnregister: false,
        control: control
    });
    const { fields, append, prepend, remove, swap, move, insert} = ufa
const arrFields = watch(path)
    return  <div className="options-list">
        <div className="options-list-header">

            <h2>Options : </h2>
            <h3><button type={"button"} onClick={(e)=>{
                append({type: 'check',msg: '',price: 0,ingredients: {options: [],products: []}})
            }}>Add Check Item</button></h3>
                    <h3><button type={"button"} onClick={(e)=>{
                append({type: 'select',msg: '',choices: []})
            }}>Add Multiple Select Item</button></h3>  

        </div>
        <div className="options-types">
        { arrFields && arrFields.map((opt,index)=>{
            if(opt.type === 'check')
                return watch(`${path}.${index}`) && <div key={index} className="check-item">
                    <img className="make-img-blue" src="/checkbox.png" alt="Option" />
                    <input value={watch(`${path}.${index}.msg`)} placeholder="Message..." className="secondary-input" type="text" {...register(`${path}.${index}.msg`)} />
                    <input value={watch(`${path}.${index}.price`)} placeholder="0" className="secondary-input"  type="number" {...register(`${path}.${index}.price`)} />
                    <img  className="remove-img make-img-error" src="/trash.png" alt="Option" onClick={(e)=>{
                        remove(index)
                    }} />
                    <img className="add-img make-img-blue " src="/recipe-book.png" alt="Ingredients" onClick={(e)=>{
                        pushActive(`.options.${index}.ingredients`)
                    }} />
                </div>
            return <MultipleChoiceItem pushActive={pushActive} root={path} removeItem={remove} idx={index} key={index} />
        })
        }
        </div>
    </div>
}
const MultipleChoiceItem = ({root,idx,removeItem,pushActive})=>{
    const path = root+`.${idx}`
    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
        name: path+".choices", // unique name for your Field Array
    });
    const {register,setValue,watch} = useFormContext()
    const items  = watch(path+".choices")
    return <div className="select-item">
        <div className="select-header">
            <img className="make-img-blue" src="/radio-button.png" alt="Option" />
                <input  placeholder="Message..." className="secondary-input"  type="text" {...register(`${path}.msg`)} />
                <img className="add-img make-img-green" src="/plus.png" alt="Add Choice" onClick={(e)=>{
                append({msg: '',price: '',ingredients: {options: [],products: []} })
                }} />
                <img className="remove-img make-img-error" src="/trash.png" alt="Option" onClick={(e)=>{
                    removeItem(idx)
                }} />

        </div>

        <div className="choices">
            { items && items.map((choice,index)=><div className="choice-item"  key={index}>
                <img className="make-img-blue" src="/radio.png" alt="radio" />
                <input placeholder="Message..." className="secondary-input"  type="text" {...register(`${path}.choices.${index}.msg`)} />
                <input placeholder="0" className="secondary-input"  type="number" {...register(`${path}.choices.${index}.price`)} />
                <img className="remove-img make-img-error" src="/trash.png" alt="Option" onClick={(e)=>{
                        remove(index)
                }} />
                <img className="add-img make-img-blue " src="/recipe-book.png" alt="Ingredients" onClick={(e)=>{
                    pushActive(`.options.${idx}.choices.${index}.ingredients`)
                }} />
            </div>)
            }
            </div>
        </div>
}
const productSchema = joi.object({
    name : joi.string().required().label("Name"),
    quantity : joi.number().required().label("Quantity"),
    price : joi.number().required().label("Price")
})

const SelectionTable = ({root,popActive})=>{
    let path = root.join('')+'.products'
    const {register,setValue,watch,control} = useFormContext()
    const ufa = useFieldArray({
        name: path, // unique name for your Field Array,
        control: control
    });
    const { fields, append, prepend, remove, swap, move, insert } = ufa
    const columns = useMemo(()=>{
        return [{
            Header: 'Name',
            accessor: 'name'
        },
        {
            Header: 'Quantity',
            accessor: 'quantity'
        },{
            Header: 'Price',
            accessor: 'price'
        }]
    },[])
    const tb = useTable({data:  watch(path) || [],columns: columns})
    return <div className="products-table">

        <div className="products-list-header">
            <h2>Products : </h2>
            <h3>
                <button type={"button"} onClick={(e)=>{e.preventDefault();popActive()}} >Previous</button>
                <button type={"button"} onClick={(e)=>{e.preventDefault();append({name: "lel",quantity: 4,price: 100})}}>Add Product</button>
            </h3>  
        </div>
        
        <table {...tb.getTableProps()}>
            <thead>
                {tb.headerGroups.map((headerGroup)=><tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column)=><th {...column.getHeaderProps()}>{column.render("Header")}</th>)}
                <th>Action</th>
                </tr>)}
            </thead>
            <tbody {...tb.getTableBodyProps()}>
                {tb.rows.map((row,rowidx)=>{
                    tb.prepareRow(row)
                    return <tr {...row.getRowProps()}>{
                        row.cells.map((cell)=><td {...cell.getCellProps()}>{cell.render("Cell")}</td>)
                    }
                    <td>
                        <button type={"button"}>Update</button>
                        <button type={"button"} onClick={(e)=>remove(rowidx)}>Remove</button>
                    </td>
                    </tr>
                })}
            </tbody>
        </table>
    </div> 
}
export default FoodDetails