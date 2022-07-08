import { useNavigate, useParams } from "react-router"
import {useForm} from 'react-hook-form'
import {Link} from "react-router-dom"
import { useContext } from "react"
import {OrderContext} from "./Contexts"
import hash from "object-hash"
import GetFoodById from "../Lib/GetFoodById"
import { computePrice } from "../Lib/util"
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
    var {id,cartid,tableid} = useParams() 
    var food = null
    if(cartid){
        var initfood = order.cart.find(f=>f.cartid === cartid)
        if(!initfood)
            return "Error , Item do not exist in Cart"
        id = initfood.id
    }
    if(id){
        var {data,error,loading} = GetFoodById(id)
        if(error)
            return "errro"
        if(loading)
            return "loading"
        food = data
        console.log("FD",food)
    }
    return <div className="food-details-container">
        <div className="food-details">
            <div className="food-img">
                <img src={food.img} alt={food.title}/>
            </div>
            <div className="food-info">
            <Link to={'/'+tableid}>Main Menu</Link>
                <h2>{food.title}</h2>
                <p className="category">{food.category}</p>
                <p className="description">{food.description}</p>
                <p className="price">Price :{food.price}</p>
                <div className="food-custom">
                    {food && food.options && Object.keys(food.options).length > 0 && <h2>Ajouter Des Supplements:</h2>}
                    <Options food = {food} initfood={initfood} />
                </div>
            </div>
        </div>
    </div>
}

const Options = ({food,initfood = null})=>{
    const [order,setOrder] = useContext(OrderContext)
    const usenav = useNavigate()
    const {tableid} = useParams()
    const addToCart = (data)=>{
        const cmd = {...food}
        if(data)
            cmd.options = data
        if(food.options){
            cmd.price =computePrice(food,data)
        }
        if(!cmd.count)
            cmd.count = 1
        cmd.cartid = hash({options: cmd.options,id : cmd.id})
        if(initfood){
        {
            const idx = order.cart.findIndex(f => f.cartid === initfood.cartid)
            if(idx ===-1)
                return;
            /*order.cart.splice(idx,1)
            order.cart.push(cmd)*/
            order.cart[idx].options = cmd.options
            order.cart[idx].cartid = cmd.cartid
        }
            setOrder({...order})
            usenav("/"+tableid)
        } else{
            //try to find an order similar to upgrade the count 
            const idx = order.cart.findIndex(f => f.cartid === cmd.cartid)
            if(idx ===-1)
                order.cart.push(cmd)
            else{
                order.cart[idx].count +=1
                /*order.cart.push(order.cart[idx])
                order.cart.splice(idx,1)*/
            }
            setOrder({...order})        
        }
    }

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: initfood ? initfood.options : {}
  });
  return <form onSubmit={handleSubmit(addToCart)}>
    {food && food.options && food.options.map((opt,key)=><div className="form-input-container" key={key}> 
    <label htmlFor={opt.msg}>{opt.msg} {opt.price}$</label>
    <br />
    {opt.type === 'select' ? opt.choices.map((c)=><div className="form-input"  key={c.msg}>
        <label htmlFor={c.msg}>{c.msg} {c.price}$</label>
        <input type="radio" value={c.msg} name={opt.msg} id={c.msg} {...register(opt.msg,{required:true})} />
    </div>
    ) :  <div className="form-input">
    <input type="checkbox" id={opt.msg} {...register(opt.msg)}/>
 </div>}
    </div>)
    }
    <button type="submit">{initfood ? "Update" : "Ajouter"}</button>
  </form>

}
export default FoodDetails