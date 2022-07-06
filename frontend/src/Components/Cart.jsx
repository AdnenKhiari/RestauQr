import { useContext,useState} from "react"
import { CartContext } from "./Contexts"
import { useNavigate} from "react-router-dom"
import * as ROUTES from "../Routes/UI"

const Cart = ()=>{
    const [cart,setCart] = useContext(CartContext)
    const [active,setActive] = useState(false)
    const getReducedCart = (ct)=>{
        const prev = []
        ct.forEach((cur)=>{
            const idx = prev.findIndex(it => it.id === cur.id)
            if(idx === -1){
                prev.push({...cur,count : 1})
            }else{
                const el = prev[idx]
                el.count = el.count +1
            }
        } ,[])
        return prev
    }

    const removeFromCart = (id)=>{
        cart.splice(cart.findIndex(it => it.id === id),1)
        setCart([...cart])
    }
    const usenav = useNavigate()

    return <div className="cart-container">
        <img className={"cart-img" + (active ? ' cart-img-active' : '')} src="/menu.png" alt="" onClick={(e)=>setActive(!active)} />
        <div className={"cart-content" + (active ? '' : ' cart-content-hide')}>
            <div>
            {cart && /*getReducedCart()*/cart.map((item,index)=><div key={item.id} className="cart-item">
                <img src={item.img} alt={item.title}  />
                <div>
                    <p>{item.title}</p>uusenavsenav
                    <p>Price: {item.price}</p>
                    <p>Q: {item.count}</p>
                </div>
                <img src="/close.png" alt="remove" onClick={(e)=>removeFromCart(item.id)} />
            </div>)}
            </div>
            <button onClick={(e)=>usenav(ROUTES.CART_DETAILS)} >Passer Commande</button>
        </div>
    </div>
}
export default Cart