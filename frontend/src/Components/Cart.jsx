import { useContext,useState} from "react"
import { OrderContext } from "./Contexts"
import { useNavigate} from "react-router-dom"
import * as ROUTES from "../Routes/UI"
import { getReducedCart, RemoveFromCart } from "../Lib/util"

import menuimg from "../images/menu.png"
import closeimg from "../images/close.png"

const Cart = ()=>{
    
    const [order,setOrder] = useContext(OrderContext)
    const [active,setActive] = useState(false)

    const usenav = useNavigate()

    return <div className="cart-container">
        <div>
        <img className={"cart-img" + (active ? ' cart-img-active' : '')} src={menuimg}alt="" onClick={(e)=>setActive(!active)} />
        <div className={"cart-content" + (active ? '' : ' cart-content-hide')}>
        <h2>Commandes</h2>  
            <div className="cart-item-container">
                
            {order.cart && order.cart.map((subcart,subkey) => subcart.food.map((item)=><div key={subkey + "-"+item.cartid} className="cart-item">
                <img src={item.img} alt={item.title}  />
                <div>
                    <p>{item.title}</p>
                    <p>Price: {item.price}</p>
                    <p>Quantity: {item.count}</p>
                    <p>Order Num: {subkey+1}</p>
                </div>
                <img src={closeimg} alt="remove" className="rm-item-cart" onClick={(e)=>RemoveFromCart(order,setOrder,item.cartid)} />
            </div>) )}
            </div>
            <button onClick={(e)=>{usenav(ROUTES.CART_DETAILS);setActive(false)}} >Commandes</button>
        </div>
        </div>

    </div>
}
export default Cart

