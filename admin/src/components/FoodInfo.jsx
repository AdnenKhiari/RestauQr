import {FormProvider, useFieldArray, useForm, useFormContext, useWatch} from "react-hook-form"
import UploadFile from "../lib/UploadFile"
import {AddUpdateFood} from "../lib/FoodDal"
import {useNavigate} from "react-router-dom"
import * as ROUTES from "../ROUTES"
import DropDown from "react-dropdown"
import{joiResolver} from "@hookform/resolvers/joi"
import joi, { options } from "joi"
import {GetCategories} from "../lib/Categories"
import Loading from "./Loading"
import Error from "./Error"
import { FadeIn } from "../animations"
import {motion} from "framer-motion"
import {useTable} from "react-table"
import { useEffect, useMemo, useState } from "react"
import ProductsTables from "./Tables/ProductsTable"


import addimage from "../images/addimage.png"
import nextimg from "../images/next.png"
import backimg from "../images/back.png"
import checkboximg from "../images/checkbox.png"
import trashimg from "../images/trash.png"
import plusimg from "../images/plus.png"
import radioimg from "../images/radio.png"
import radiobuttonimg from "../images/radio-button.png"
import recipebookimg from "../images/recipe-book.png"
import UnitShow from "./Custom/UnitShow"
import UnitValue from "./Custom/UnitValue"
import { GetUnits } from "../lib/Units"

let formatCurrency = new Intl.NumberFormat(undefined, {
	style: 'currency',
	currency: 'USD'
});

const productSchema = joi.object({
    id: joi.string().optional() ,
    name : joi.string().required().label("Name"),
    quantity : joi.object({
        value: joi.number(),
        unit: joi.any()
    }).required().label("Quantity"),
    unit: joi.object({
        id: joi.string(),
        name: joi.string(),
        subunit: joi.object({
            name: joi.string(),
            ratio: joi.number()
        }).optional()
    }),
    customUnits: joi.array().items(joi.object({
        name: joi.string(),
        ratio:  joi.number()
    })).optional(),
//    price: joi.optional().number().label("Price"),
    sellingUnitPrice: joi.number(),
    unitQuantity: joi.number()
}).optional()

const ingredientsSchema = joi.object({
    options: joi.array().optional().items(
    joi.object({
        msg: joi.string().required().label('Item Message'),
        type: joi.allow('check').required(),
        price: joi.number().min(0).required().label('Item Price'),
        ingredients: joi.link('#ingr').optional()
    }).optional()
    , 
    joi.object({
        msg: joi.string().required().label('Item Message'),
        type: joi.allow('select').required(),
        choices: joi.array().optional().items(joi.object({
            msg: joi.string().required().label('Item Selection Message'),
            price: joi.number().min(0).label('Item Selection Price'),
            ingredients: joi.link('#ingr').optional()
        }))
    }).optional()),
    products: joi.array().items(productSchema).label("Products")

}).id("ingr")


const schema = joi.object({
    id: joi.string().optional().label('ID'),
    title: joi.string().required().label('Food Name'),
    description: joi.string().required().label('Food Description'),
    category: joi.string().required().label('Food Category'),
    img: joi.any().required().label('Food Image'),
    price: joi.number().min(0).required().label('Food Price'),
    ingredients: ingredientsSchema
})

const FoodDetails = ({defaultVals = undefined})=>{

    const process_default = (food)=>{
        food.products = food.products.map((ing)=>{
            ing.quantity = {
                value: ing.quantity / (ing.unit.subunit?.ratio || 1) ,
                unit: ing.unit
            }
            return ing
        })
        food.options.forEach(opt => {
            if(opt.type==="check")
                opt.ingredients = process_default(opt.ingredients)
            else{
                opt.choices.forEach((sub)=>{
                    sub.ingredients = process_default(sub.ingredients)
                })
            }
        });
        return food
    }

    const formOptions = useForm({
        defaultValues: {...defaultVals,ingredients: process_default(defaultVals.ingredients)} || {
            title: '',
            img: null,
            description: '',
            category: '',
            ingredients: '',
        },
        resolver: joiResolver(schema)
    })
    const {handleSubmit,register,setValue,watch,reset,formState : {errors}} = formOptions
    const uploader = UploadFile()
    const food_uploader = AddUpdateFood(!defaultVals)
    const usenav = useNavigate() 
    const {result : categories,loading: categoriesLoading,error : errorCategories} = GetCategories()
    const {result: allunits,unitsLoading,errorUnits} = GetUnits()
    //console.log(watch())
    const SubmitForm = async (data)=>{

        try{
            console.log("Before processing data",data)
            const updateQuantity = (food) =>{
                food.products = food.products.map((ing)=>{
                    ing.quantity = ing.quantity.value * (ing.unit?.subunit?.ratio || 1)
                    return ing
                })
                food.options.forEach(opt => {
                    if(opt.type==="check")
                        opt.ingredients = updateQuantity(opt.ingredients)
                    else{
                        opt.choices.forEach((sub)=>{
                            sub.ingredients = updateQuantity(sub.ingredients)
                        })
                    }
                });
                return food
            }
            data.ingredients = updateQuantity(data.ingredients)
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
    if(categoriesLoading || unitsLoading)
        return <Loading />
    if(errorCategories || errorUnits)
        return <>
        {errorCategories && <Error error={errorCategories} msg={"Could Not Retrieve the categories"} />}
        {errorUnits && <Error error={errorUnits} msg={"Could Not Retrieve the Units"} />}
        </>

      return <motion.div variants={FadeIn()} className="secondary-form">
        <h1>{defaultVals ? "Update Food : " + defaultVals.id :"Add Food" } </h1>
        <FormProvider {...formOptions}>
        <form onReset={(e)=>{e.preventDefault();reset()}}  onSubmit={handleSubmit(SubmitForm)}>
        <div className="input-item">
        <label htmlFor="title"><h2>Name : </h2></label>
            <input  placeholder="Name" className={"secondary-input " + (errors.title ? 'input-error' : '')} type="text" id="title" {...register('title')} />
        </div>
        <label htmlFor='img'>
            <img className={"secondary-img " + (errors.img ? 'input-error' : '')} src={(watch('img') && (typeof(watch('img')) === 'string' ? watch('img') :  URL.createObjectURL(new Blob(watch('img'))) )   ) || addimage }  alt="" />
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
            arrowOpen={<img alt="open" src={nextimg} />}
            arrowClosed={<img alt="open" src={backimg} />}
            />
        </div>      
        
        <Ingredients allunits={allunits} defaultVals={defaultVals} />

        {errors["title"] && <p className="error">{errors["title"].message.replaceAll('"','') }</p>}
        {errors["description"] && <p className="error">{errors["description"].message.replaceAll('"','') }</p>}
        {errors["price"] && <p className="error">{errors["price"].message.replaceAll('"','') }</p>}
        {(!watch('category') || true)  && errors["category"] && <p className="error">{errors["category"].message.replaceAll('"','') }</p>}
        {errors["img"] && <p className="error">Select a valid image</p>}
        {errors["ingredients"] && <p className="error">Errors on ingredients inputs</p>}

        <div className="validate">
            <button type={"reset"}>Reset</button>
            <button type="submit">{defaultVals ? "Update" : "Add"}</button>
        </div>

        </form>
        </FormProvider>
    </motion.div>
}
const Ingredients = ({allunits,defaultVals})=>{
    const [active,setActive] = useState(["ingredients"])
    const [labels,setLabels] = useState(["Base"])

    const {watch,setValue,register,reset,control} = useFormContext()

    const popActive = ()=>{
        if(active.length <= 1)
            return
        active.pop()
        setActive([...active])
    }
    const pushActive = (item)=>{
        active.push(item)
        setActive([...active])
    }

    const pushLabel= (item)=>{
        labels.push(item)
        setLabels([...labels])
    }

    const popLabel= (item)=>{
        if(labels.length <= 1)
            return
        labels.pop()
        setLabels([...labels])
    }

    return  <div className="ingredients-details">
        <h1 style={{margin: "15px 0px"}}>Ingredients : <small>{labels && labels.join('/')}</small></h1>
        <SelectionTable defaultVals={defaultVals} allunits={allunits} popLabel={popLabel} popActive={popActive} root={active} />  
        <Options pushLabel={pushLabel} pushActive = {pushActive} root={active}/>
    </div>
}

const Options = ({root,pushActive,pushLabel})=>{
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
                    <img className="make-img-blue" src={checkboximg} alt="Option" />
                    <input value={watch(`${path}.${index}.msg`)} placeholder="Message..." className="secondary-input" type="text" {...register(`${path}.${index}.msg`)} />
                    <input value={watch(`${path}.${index}.price`)} placeholder="0" className="secondary-input"  type="number" {...register(`${path}.${index}.price`)} />
                    <img  className="remove-img make-img-error" src={trashimg} alt="Option" onClick={(e)=>{
                        remove(index)
                    }} />
                    <img className="add-img make-img-blue " src={recipebookimg} alt="Ingredients" onClick={(e)=>{
                        pushActive(`.options.${index}.ingredients`)
                        pushLabel(watch(`${path}.${index}.msg`))
                    }} />
                </div>
            return <MultipleChoiceItem pushLabel={pushLabel} pushActive={pushActive} root={path} removeItem={remove} idx={index} key={index} />
        })
        }
        </div>
    </div>
}
const MultipleChoiceItem = ({root,idx,removeItem,pushLabel,pushActive})=>{
    const path = root+`.${idx}`
    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
        name: path+".choices", // unique name for your Field Array
    });
    const {register,setValue,watch} = useFormContext()
    const items  = watch(path+".choices")
    return <div className="select-item">
        <div className="select-header">
            <img className="make-img-blue" src={radiobuttonimg} alt="Option" />
                <input  placeholder="Message..." className="secondary-input"  type="text" {...register(`${path}.msg`)} />
                <img className="add-img make-img-green" src={plusimg} alt="Add Choice" onClick={(e)=>{
                append({msg: '',price: '',ingredients: {options: [],products: []} })
                }} />
                <img className="remove-img make-img-error" src={trashimg} alt="Option" onClick={(e)=>{
                    removeItem(idx)
                }} />
        </div>

        <div className="choices">
            { items && items.map((choice,index)=><div className="choice-item"  key={index}>
                <img className="make-img-blue" src={radioimg} alt="radio" />
                <input placeholder="Message..." className="secondary-input"  type="text" {...register(`${path}.choices.${index}.msg`)} />
                <input placeholder="0" className="secondary-input"  type="number" {...register(`${path}.choices.${index}.price`)} />
                <img className="remove-img make-img-error" src={trashimg} alt="Option" onClick={(e)=>{
                        remove(index)
                }} />
                <img className="add-img make-img-blue " src={recipebookimg} alt="Ingredients" onClick={(e)=>{
                    pushActive(`.options.${idx}.choices.${index}.ingredients`)
                    pushLabel(watch(`${path}.choices.${index}.msg`))
                }} />
            </div>)
            }
            </div>
        </div>
}

const SelectionTable = ({allunits,defaultVals,root,popActive,popLabel})=>{
    let path = root.join('')+'.products'
    const {register,setValue,watch,control} = useFormContext()
    const ufa = useFieldArray({
        name: path, // unique name for your Field Array,
        control: control
    });
    const { fields, append, update, remove, swap, move, insert } = ufa

    const [mutateProduct,setMutateProduct] = useState(null)
    const arr = watch(path)
    console.log(arr)
    const columns = useMemo(()=>{
        return [{
            Header: 'Name',
            accessor: 'name'
        },
        {
            Header: 'Quantity/U',
            accessor: 'unitQuantity',
            Cell: ({value,row})=> {
                const prod_unit = row.original.unit
                const val = value
                return <UnitShow unitval={{value: value,unit: row.original.unit}}  />
            }
        },
        {
            Header: 'Price/U',
            accessor: 'sellingUnitPrice'
        },
        {
            Header: 'Quantity',
            accessor: 'quantity',
            Cell: ({value,row})=>{
                const product = row.original
                return <UnitValue  inputcustomprops={{className:"secondary-input" ,id:"unitQuantity"}}
                type="number"  
                register={register}  
                          name={`${path}.${row.id}.quantity`}
                          control={control}     
                          customunits={product.customUnits ? [{...product.unit,customUnits: product.customUnits }] : undefined}
                          defaultValue={{value:  defaultVals ? defaultVals.quantity?.value : 0,units: product.unit}} 
                          units={allunits.filter((un)=>un.id === product.unit.id)} />  /*                return <input 
                step={"any"}  

                className="secondary-input" 
                type="number" 
                {...register(`${path}.${row.id}.quantity`)} />*/
            }
        },{
            Header: 'Price',
            accessor: 'price',
            Cell : ({value,row})=>{
                console.log(row)
                return <b>{formatCurrency.format(row.original.sellingUnitPrice * 1.0 * (row.original.quantity.value * (row.original.quantity.unit?.subunit?.ratio || 1) ) / row.original.unitQuantity || 0)}</b> 
            }
        }]
    },[allunits,register,control,path])

    const tb = useTable({data: arr  || [],columns: columns})

    const addProduct = (prod,index)=>{
        if(!arr.find(item=>item.id === prod.id))
            append({name: prod.name,customUnits: prod.customUnits,unit: prod.unit,unitQuantity:prod.unitQuantity,quantity: 0,sellingUnitPrice: prod.sellingUnitPrice,id: prod.id})
        setMutateProduct(null)
    }

    const modifyProduct = (prod,index)=>{
        if(!arr.find(item=>item.id === prod.id))
            update(index,{name: prod.name,customUnits: prod.customUnits,unit: prod.unit,unitQuantity:prod.unitQuantity,quantity: 0,sellingUnitPrice: prod.sellingUnitPrice,id: prod.id})
        setMutateProduct(null)
    }


    return <>{mutateProduct !== null && 
        <>
        <button 
        type="button" 
        style={{color: "white",marginLeft: "40px"}} 
        onClick={(e)=>setMutateProduct(null)}>Cancel Select !</button>
        <ProductsTables title={""} 
        oncl={(row)=> mutateProduct === "add" ? addProduct(row) : modifyProduct(row,mutateProduct)} />
        </>}
     <div className="secondary-table">

        <div className="products-list-header">
            <h2>Products : </h2>
            <h3>
                <button type={"button"} onClick={(e)=>{e.preventDefault();popLabel();popActive()}} >Previous</button>
                <button type={"button"} onClick={(e)=>{e.preventDefault();setMutateProduct("add")}}>Add Product</button>
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
                        row.cells.map((cell)=><td {...cell.getCellProps()}>
                            {
                                cell.render("Cell")
                            }
                            </td>)
                    }
                    <td>
                        <button onClick={(e)=>{e.preventDefault();setMutateProduct(rowidx)}} type={"button"}>Update</button>
                        <button type={"button"} onClick={(e)=>remove(rowidx)}>Remove</button>
                    </td>
                    </tr>
                })}
                <tr><td></td><td></td><td></td><td></td><td><h2> Total: {formatCurrency.format(watch(path) ? watch(path).reduce((prev,fd)=>{
                    return prev +   fd.sellingUnitPrice * 1.0 * (fd.quantity.value * (fd.quantity.unit?.subunit?.ratio || 1) || 0  )  / fd.unitQuantity
                },0) : 0)} </h2></td><td></td></tr>
            </tbody>
        </table>

    </div> 
    </>
}
export default FoodDetails