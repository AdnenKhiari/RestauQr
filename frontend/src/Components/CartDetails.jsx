import { useContext } from "react"
import {  OrderContext } from "./Contexts"
import { Link, useNavigate, useParams } from "react-router-dom"

import * as ROUTES from "../Routes/UI"
import { getReducedCart, RemoveFromCart } from "../Lib/util"
import UpdateCart from "../Lib/UpdateCart"
import RemoveOrder from "../Lib/RemoveOrder"


const CartDetails = ()=>{
    const [order,setOrder] = useContext(OrderContext)
    console.log(order)
    const {tableid} = useParams()
    const usenav = useNavigate()
    const updateOrder = UpdateCart()
    const removeOrder = RemoveOrder()
    const processCart = ()=>{
        return getReducedCart(order.cart).map((item)=>{
            return {
                id: item.id,
                options : item.options,
                count : item.count
            }
        })
    }
    return <div className="cart-details-container">
    {(!order.cart || !order.cart.length) ? <h2>Veuillez commander au moins un article</h2> : (<>
    <div className="cart-details">
    {getReducedCart(order.cart).map((item,index)=> <CartItem key={index} item = {item} />)}
    </div>
    <div>
        <h2>Total: {(order.cart).reduce((prev,cur)=>prev + cur.price * cur.count,0)}</h2>
        <div>
            <button onClick={(e)=>usenav("/"+tableid)}>Menu</button>
            <button onClick={(e)=> updateOrder(processCart()) }>
                {!order.status ? "Commander !": "Update"}
            </button>
            {order.status && order.status === "waiting" && <button onClick={(e)=> removeOrder() }>Cancel Order</button>}
        </div>
    </div>
    </>
    )}
    </div>
}
const CartItem = ({item})=>{
    const [order,setOrder] = useContext(OrderContext)
    const {tableid} = useParams()
    const usenav = useNavigate()
    return <div className="cart-details-item" >
        <div>
            <img src="/close.png" onClick={(e)=>RemoveFromCart(order,setOrder,item.cartid)} className="rm-item-cart" alt="" />
            <h2>{item.title}</h2>
        </div>
        <div>
            <img src={item.img} alt={item.title} onClick={(e)=>usenav(ROUTES.GET_FOOD_UPDATE(tableid,item.cartid))}/>
            <div className="item-info">
                <div>
                    {item.options && Object.keys(item.options).map(opt=> item.options[opt].value ? <p key={opt}>{opt} {item.options[opt].name} </p> : <></>)}
                </div>
                <p className="item-price">{item.count}x{item.price}$</p>
            </div>
        </div>
    </div>
}
export default CartDetails 