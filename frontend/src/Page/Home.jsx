import { Routes,Route, useNavigate } from "react-router-dom"
import Menu from "../Components/Menu/Menu"
import * as ROUTES from "../Routes/UI"
import Cart from "../Components/Cart"
import FoodDetails from "../Components/FoodDetails"
import CartDetails from "../Components/CartDetails"
import {useState} from "react"
import { CartContext } from "../Components/Contexts";
import { populateMenu } from "../Lib/util"


const Home = ()=>{
    const [cart,setCart] = useState([])
    const usenav = useNavigate()
    return <>
        <CartContext.Provider value={[cart,setCart]}>
        <div className="hero">
            <h1 onClick={(e)=>usenav("/")}>Restaurant Kdhe</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
            <button onClick={(e)=>populateMenu()}>Populate Data</button>
        </div>
        <Cart />
        <Routes>
        <Route path='/' element={<div className="menu-container">
        <Menu />
        </div>} />
        <Route path={ROUTES.FOOD_DETAILS} element={<FoodDetails />}/>
        <Route path={ROUTES.FOOD_UPDATE} element={<FoodDetails  />}/>
        <Route path={ROUTES.CART_DETAILS} element={<CartDetails />}/>
        </Routes>
        </CartContext.Provider>
    </>
}

export default Home