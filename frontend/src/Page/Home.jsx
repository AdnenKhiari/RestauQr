import { Routes,Route, useNavigate, useParams } from "react-router-dom"
import Menu from "../Components/Menu/Menu"
import * as ROUTES from "../Routes/UI"
import Cart from "../Components/Cart"
import FoodDetails from "../Components/FoodDetails"
import CartDetails from "../Components/CartDetails"
import {useState} from "react"
import { OrderContext } from "../Components/Contexts";
import { populateMenu } from "../Lib/util"
import GetOrder from "../Lib/GetOrder"
import { useEffect } from "react"
import { useCallback } from "react"
import ValidateTableId from "../Lib/ValidateTableId"
import GetCategories from "../Lib/GetCategories"

const Home = ()=>{
    const usenav = useNavigate()
    const {tableid} = useParams()
    const {order,setOrder,loading,error} = GetOrder()
    const tvalid = ValidateTableId(parseInt(tableid))
    const allCategories = GetCategories()

    if(tvalid.loading)
        return <h1>Loading ...</h1>
    if(tvalid.error)
        return <h1>Invalid Table Number</h1>
    if(loading)
        return <h1>Loading ...</h1>
    if(allCategories.loading)
        return <h1>Loading ...</h1>
    if(allCategories.error)
        return <h1>Error, Could not get categories</h1>
    if(error){
        console.log(error)
        return <h1>Error</h1>
    }


    return <>
        <OrderContext.Provider value={[order,setOrder]}>
        <div className="hero">
            <div>

            <h1 onClick={(e)=>usenav("/"+tableid)}>Restaurant Kdhe</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nihil ab sequi assumenda optio et eius laboriosam velit dolor itaque, corporis quos a ea id ratione similique animi voluptates reprehenderit quis.</p>

            <button onClick={(e)=>usenav(ROUTES.CART_DETAILS)}>Commander</button>
           {false && <button onClick={(e)=>populateMenu()}>Populate Data</button>}
            </div>
        </div>
        <Cart />
        <Routes>
            <Route path='/'> 
                <Route path='/' index element={<div className="menu-container">
                <Menu cats={allCategories.data} />
                </div>} />
                <Route path={ROUTES.FOOD_DETAILS} element={<FoodDetails />}/>
                <Route path={ROUTES.CART_DETAILS} >
                    <Route index element={<CartDetails />} />
                    <Route path={ROUTES.FOOD_UPDATE} element={<FoodDetails  />}/>
                </Route>
            </Route>
        </Routes>
        </OrderContext.Provider>
    </>
}

export default Home