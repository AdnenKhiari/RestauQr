import { useNavigate, useParams } from "react-router"
import {useForm,FormProvider, useFormContext, useFieldArray} from 'react-hook-form'
import {Link} from "react-router-dom"
import React, { useContext } from "react"
import {OrderContext} from "./Contexts"
import hash from "object-hash"
import GetFoodById from "../Lib/GetFoodById"
import { computePrice, hashFood, prepareToHash } from "../Lib/util"
import { useState } from "react"
import { useEffect } from "react"
import { joiResolver } from '@hookform/resolvers/joi';
import joi from "joi"

const ingredientsSchema = joi.object({
    options: joi.array().optional().items(
    joi.object({
        name: joi.string().required().label('Item Message'),
        value: joi.alternatives(joi.boolean(),joi.string()).required(),
        ingredients: joi.link('#ingr').optional()
    }).optional()).optional()
}).id("ingr")

const schema = joi.object({
    ingredients: ingredientsSchema,
})

/*
const tempfood = {
    id: '24U249289',
    title: 'Pizza Neptune',
    img: "https://img.cuisineaz.com/660x660/2021/07/28/i179970-pizza-neptune.webp",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias fugiat ad dicta aliquam reprehenderit corporis est sed, unde excepturi itaque dolorem laboriosam! Reprehenderit fugiat adipisci modi ipsa minima ratione mollitia.",
    price: 10,
    category: 'Pizza',
    options: [
    {
        type: 'check',
        price: 3,
        msg: 'Double Fromage'
    },{
        type: 'check',
        price: 2,
        msg: 'Double Thon'
    },{
        type: 'select',
        msg: 'Taille',
        choices:[{price: 0,msg: 'Mini'},{price: 2,msg: 'Moyenne'},{price: 4,msg: 'Large'},{price: 8,msg: 'XL'}]
    }]
}
*/

const FoodDetails = ()=>{
    const [order,setOrder] = useContext(OrderContext)
    var {id,ordnum,cartid,tableid} = useParams() 
    var food = null
    if(cartid){

        ordnum = parseInt(ordnum)
        if((isNaN(ordnum) || ordnum < 0 || ordnum >= order.cart.length ))
            return "Error , Order Number Invalid"

        var initfood = order.cart[ordnum].food.find(f=>f.cartid === cartid)
        if(!initfood)
            return "Error , Item do not exist in Cart"
        id = initfood.id
        console.log("Init Fodd",initfood)
    }
    if(id){
        console.warn("I'm getting new food")
        var {data,error,loading} = GetFoodById(id)
        if(error)
            return "errro"
        if(loading)
            return "loading"
        food = data
    }
    console.log("FD",food,"Order Num",ordnum)

    return <div className="food-details-container">
        <div className="food-details">
            <h1><img  className="make-img-primary" src="/etoiles.png" alt="" />{food.title}<img className="make-img-primary" src="/etoiles.png" alt="" /></h1>
            <div>
                <div className="food-img" style={{backgroundImage: "url("+food.img+")"}}>
                    {/*<img src={food.img} alt={food.title}/>*/}
                </div>
                <div className="food-info">
                    <p className="category">{food.category}  <span className="price">{food.price}$</span></p>
                    <p className="description">{food.description}</p>
                    {food.ingredients && food.ingredients.options && <p className="opt">Options :</p>}
                    <div className="food-custom">
                        <Choices ordernum={ordnum !== undefined ? ordnum : order.cart.length - 1} food = {structuredClone(food)} initfood={initfood} />
                    </div>
                </div>
            </div>
        </div>
    </div>
}
const IngredientsUi = ({parent,options,root})=>{
    const path = `${root}.options`
    const {append} = useFieldArray({
        name: path
    })
    return <>
    {options && options.map((opt,index)=><Option 
    root={path} 
    index={index}
    parent={parent}
    key={index*123} 
    opt={opt} />)}
    </>
}
const Ingredients = ({food,setOpenSubmit,openSubmit,initfood})=>{

    //not verry optimal memory managment xD
    const [active,setActive] = useState(food.ingredients && food.ingredients.options ?[[{path: "ingredients",parent:"",options: food.ingredients.options}]] : [ ])
    const {watch,trigger, formState : {errors}} = useFormContext()
    const nextActive = async ()=>{
        

        if(!(await trigger()))
            return;
        const red = []
        
        active[active.length - 1].forEach((item)=>{
            const states = watch(`${item.path}.options`)
            item.options && item.options.forEach((opt,index)=>{
                if(states[index].value){

                    if(opt.type === "select"){
                        opt = opt.choices.find((g)=>g.msg === states[index].value )
                    }
                    
                    if(opt && opt.ingredients && opt.ingredients.options && opt.ingredients.options.length > 0)
                    red.push({
                        path: `${item.path}.options.${index}.ingredients`,
                        parent: item.parent+opt.msg+"/",
                        options: opt.ingredients && opt.ingredients.options 
                    })
                }
            
            })
        })
        if(red.length > 0){
            setOpenSubmit(false)
            setActive([...active,red])
        }else{
            setOpenSubmit(true)
        }     
    }
    const popActive = ()=>{
        setOpenSubmit(false)
        if(active.length <=1 )
            return
        active.pop()
        setActive([...active])
    }

    return <div className="options">  
        {!openSubmit && food.ingredients && food.ingredients.options && active[active.length - 1].map((current,ind) => <IngredientsUi key={ind } parent={current.parent} options={current.options} root={current.path}/>)}
        <div className="btns">
            {food.ingredients && food.ingredients.options && food.ingredients.options.length > 0 && <button type="button" onClick={(e)=>popActive()}>Previous</button>}
            {!openSubmit && food.ingredients && food.ingredients.options &&  food.ingredients.options.length > 0 &&  <button type="button" onClick={(e)=>nextActive()}>Next</button>}
            {(openSubmit || !food.ingredients || !food.ingredients.options || food.ingredients.options.length === 0 ) && <button type="submit">{initfood ? "Update" : "Ajouter"}</button>}
        </div>
    </div>
}

const Choices = ({food,initfood = null,ordernum})=>{
    const [order,setOrder] = useContext(OrderContext)
    const usenav = useNavigate()
    const {tableid} = useParams()
    const [openSubmit,setOpenSubmit] = useState(false)
    const addToCart = (data)=>{
        const cmd = {...food}
        if(data.ingredients && data.ingredients.options)
            cmd.price = computePrice(cmd,data.ingredients.options)
        cmd.options = (data.ingredients && data.ingredients.options) || []
        const current_order = order.cart[ordernum].food
        if(!initfood)
            cmd.count = 1
        else
            cmd.count = initfood.count
        const oldcartid = initfood ? initfood.cartid : ""
        cmd.cartid = hashFood(cmd.id,cmd.options)
        if(initfood){
            let idx = current_order.findIndex(f => f.cartid === oldcartid)
            if(idx !== -1){
                current_order.splice(idx,1)
            }else{
                console.log("Did not found old")
                if(initfood)
                    usenav("/"+tableid)                
                }
        } 
        //try to find an order similar to upgrade the count 
        const idx = current_order.findIndex(f => f.cartid === cmd.cartid)
        if(idx ===-1)
            current_order.push(cmd)
        else
            current_order[idx].count += cmd.count

        setOrder({...order})    
        if(initfood)
            usenav("/"+tableid)    
    }

    const frm = useForm({
        defaultValues: initfood ? {ingredients:{options: initfood.options}} : {},
        resolver: joiResolver(schema),
        mode: "onChange",
        reValidateMode: "onChange"
      });
  const { register, handleSubmit, setValue, formState: { errors } } = frm
      console.log("er",errors)
      console.log("Ingredients",food)
  return <form onSubmit={handleSubmit(addToCart)}>
    <FormProvider {...frm}>
        {<Ingredients initfood={initfood} food={food} openSubmit={openSubmit} setOpenSubmit={setOpenSubmit} />}
    </FormProvider>
  </form>

}

const Option = ({opt,root,index,parent})=>{
    const path =  `${root}.${index}`
    const {watch,register,setValue,trigger} = useFormContext() 
    useEffect(()=>{
        setValue(`${path}.name`,opt.msg)    
        register(`${path}.name`)        
    },[opt,root,index])
    return<div className="form-input-container"> 
    
        <label className={watch(`${path}.value`) ? 'selected' : undefined} htmlFor={`${path}.${opt.msg}`}><span>{opt.price}{opt.price && "$"}</span> {parent}{opt.msg}{opt.type==="select" && " : " }
        {opt.type === 'check' && <img  className={watch(`${path}.value`) ? 'make-img-primary' : undefined} src="/checkbox.png" alt="check" />}
        </label>
            <br />
            {opt.type === 'select' ? opt.choices.map((c)=><div className="form-input"  key={c.msg}>
                <label className={watch(`${path}.value`) === c.msg ? 'selected' : undefined} htmlFor={`${path}.${opt.msg}.${c.msg}`}><span> {c.price}$</span>{c.msg} 
                {watch(`${path}.value`) === c.msg ? <img className='make-img-primary' src="/radio.png" alt="" /> : <img src="/radio-button.png" alt="" />}</label>
                <input  type="radio" value={c.msg} id={`${path}.${opt.msg}.${c.msg}`} {...register(`${path}.value`,{required:true})} />
            </div>
            ) :  <div className="form-input">
            <input data-val="true"  type="checkbox"  id={`${path}.${opt.msg}`} {...register(`${path}.value`)}/>
        </div>}
    </div>
         
}
export default FoodDetails