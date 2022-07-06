import { useContext,useState} from "react"
import { CartContext } from "./Contexts"
import { useNavigate} from "react-router-dom"
import * as ROUTES from "../Routes/UI"
import { getReducedCart, removeFromCart } from "../Lib/util"

const Cart = ()=>{
    const [cart,setCart] = useContext(CartContext)
    const [active,setActive] = useState(false)



    const usenav = useNavigate()

    return <div className="cart-container">
        <img className={"cart-img" + (active ? ' cart-img-active' : '')} src="/menu.png" alt="" onClick={(e)=>setActive(!active)} />
        <div className={"cart-content" + (active ? '' : ' cart-content-hide')}>
            <div>
            {cart && getReducedCart(cart).map((item,index)=><div key={item.id} className="cart-item">
                <img src={item.img} alt={item.title}  />
                <div>
                    <p>{item.title}</p>
                    <p>Price: {item.price}</p>
                    <p>Q: {item.count}</p>
                </div>
                <img src="/close.png" alt="remove" className="rm-item-cart" onClick={(e)=>removeFromCart(item.cartid)} />
            </div>)}
            </div>
            <button onClick={(e)=>usenav(ROUTES.CART_DETAILS)} >Passer Commande</button>
        </div>
    </div>
}
export default Cart