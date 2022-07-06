import { useContext } from "react"
import { CartContext } from "./Contexts"
import { Link, useNavigate } from "react-router-dom"

import * as ROUTES from "../Routes/UI"
import { getReducedCart, removeFromCart } from "../Lib/util"

/**
 * TODO
 * Add navigation between the ( pages )
 */

const CartDetails = ()=>{
    const [cart,setCart] = useContext(CartContext)
    console.log(cart)
    const usenav = useNavigate()
    return <div className="cart-details-container">
    {(!cart || !cart.length) ? <h2>Veuillez commander au moins un article</h2> : (<>
    <div className="cart-details">
    {(cart).map((item,index)=> <CartItem key={item.cartid + ""+index} item = {item} />)}
    </div>
    <div>
        <h2>Total: {(cart).reduce((prev,cur)=>prev + cur.price,0)}</h2>
        <div>
            <button onClick={(e)=>usenav("/")}>Menu</button>
            <button>Commander !</button>
        </div>
    </div>
    </>
    )}
    </div>
}
const CartItem = ({item})=>{
    const [cart,setCart] = useContext(CartContext)
    const usenav = useNavigate()
    return <div className="cart-details-item" >
        <img src="/close.png" onClick={(e)=>removeFromCart(cart,setCart,item.cartid)} className="rm-item-cart" alt="" />
        <h3>{item.title}</h3>
        <div>
            <img src={item.img} alt={item.title} onClick={(e)=>usenav(ROUTES.GET_FOOD_UPDATE(item.cartid))}/>
            <div className="item-info">
                <div>
                    {Object.keys(item.options).map(opt=> item.options[opt] ? <p>{opt} {item.options[opt]} </p> : <></>)}
                </div>
                <p className="item-price">{item.price}$</p>
            </div>
        </div>
    </div>
}
export default CartDetails 