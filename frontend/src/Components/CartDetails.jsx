import { useContext } from "react"
import { CartContext } from "./Contexts"
import { Link } from "react-router-dom"

import * as ROUTES from "../Routes/UI"

const CartDetails = ()=>{
    const [cart,setCart] = useContext(CartContext)
    return <div className="cart-details-container">
    {(!cart || !cart.length) ? <h2>Veuillez commander au moins un article</h2> : (<>
    <div className="cart-details">
    {cart.map((item,index)=> <CartItem key={item.id + ""+ index} item = {item} />)}
    </div>
    <div>
        <h2>Total: {100}</h2>
        <div>
            <button>Menu</button>
            <button>Commander !</button>
        </div>
    </div>
    </>
    )}
    </div>
}
const CartItem = ({item})=>{
    return <div className="cart-details-item">
        <h3>{item.title}</h3>
        <div>
            <img src={item.img} alt={item.title} />
            <div className="item-info">
                <div>
                    {Object.keys(item.options).map(opt=> item.options[opt] ? <p>{opt} {item.options[opt]} </p> : <></>)}
                </div>
                <p className="item-price">{item.price}</p>
            </div>
        </div>
    </div>
}
export default CartDetails 