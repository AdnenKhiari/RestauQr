import { Routes,Route } from "react-router-dom"
import Menu from "../Components/Menu/Menu"
import * as ROUTES from "../Routes/UI"
import Cart from "../Components/Cart"
import FoodDetails from "../Components/FoodDetails"
import CartDetails from "../Components/CartDetails"
const Home = ()=>{
    return <>
        <div className="hero">
            <h1>Restaurant Kdhe</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
        </div>
        <Cart />
        <Routes>
        <Route path='/' element={<div className="menu-container">
        <Menu />
        </div>} />
        <Route path={ROUTES.FOOD_DETAILS} element={<FoodDetails />}/>
        <Route path={ROUTES.CART_DETAILS} element={<CartDetails />}/>
        </Routes>
    </>
}

export default Home