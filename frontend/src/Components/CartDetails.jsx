import { useContext } from "react"
import {  OrderContext } from "./Contexts"
import { Link, useNavigate, useParams } from "react-router-dom"

import * as ROUTES from "../Routes/UI"
import { getReducedCart, RemoveFromCart } from "../Lib/util"
import AddUpdateCart from "../Lib/AddUpdateCart"
import RemoveOrder from "../Lib/RemoveOrder"

const CartDetails = ()=>{
    const [order,setOrder] = useContext(OrderContext)
    return <div className="suborder-details">
        {order.cart && order.cart.map((sub,key)=><SubOrderDetails ordernum={key} key={key} order={order} />)}
    </div> 
}
const SubOrderDetails = ({ordernum,order})=>{
    const {tableid} = useParams()
    const usenav = useNavigate()
    const updateOrder = AddUpdateCart()
    const removeOrder = RemoveOrder()
    const current_cart =  () => order.cart[ordernum]
    const processCart = (ordernum)=>{
        const ct = order.cart[ordernum]
            return {
                price: ct.food.reduce((prev,cur)=>prev+cur.price*cur.count,0),
                id: ct.id,
                food : ct.food.map((item)=>{
                return {
                        id: item.id,
                        category: item.category,
                        img: item.img,
                        title: item.title,
                        options : item.options,
                        count : item.count,
                        price: item.price
                    }   
                })
            }
        
    }
    return <div className="cart-details-container">
    {(!order.cart || !order.cart.length) ? <h2>Veuillez commander au moins un article</h2> : (<>
    {<h1 className="cart-status">{current_cart().status}</h1> }
    <div className="cart-details">
        {current_cart().food.length > 0 && current_cart().food.map((item,idx)=><CartItem key={idx} item = {item} ordernum={ordernum} />)}
    </div>
    {current_cart().food.length > 0 && <div>
        <h2>Total: {current_cart().food.reduce((prev,cur)=>prev + cur.price * cur.count,0)}</h2>
        <div>
            <button onClick={(e)=>usenav("/"+tableid)}>Menu</button>
            {(!current_cart().status || current_cart().status  === "Waiting") &&  <button onClick={async (e)=> {
                try{
                    if(order.cart[ordernum] && order.cart[ordernum].food &&  order.cart[ordernum].food.length > 0){
                    await updateOrder(processCart(ordernum),ordernum)
                    //usenav(0)
                }
            }catch(err){
                
                console.log("ER while adding - updating cart",err)
            }}}>
            {!current_cart().status ? 'Commander' : 'Update'}
            </button>}
            {current_cart().status && current_cart().status === 'Waiting' && <button onClick={(e)=> removeOrder(ordernum) }  >Cancel</button>}
            {/*order.status && order.status === "waiting" && <button onClick={(e)=> removeOrder() }>Cancel Order</button>*/}
        </div>
    </div>}
    </>
    )}
    </div>
}
const CartItem = ({item,ordernum})=>{
    const [order,setOrder] = useContext(OrderContext)
    const {tableid} = useParams()
    const usenav = useNavigate()
    return <div className="cart-details-item" >
        <div>
            <img src="/close.png" onClick={(e)=>RemoveFromCart(order,setOrder,item.cartid,ordernum)} className="rm-item-cart" alt="" />
            <h2>{item.title}</h2>
        </div>
        <div>
            <img src={item.img} alt={item.title} onClick={(e)=>usenav(ROUTES.GET_FOOD_UPDATE(tableid,ordernum,item.cartid))}/>
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