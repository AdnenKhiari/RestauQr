import { useState } from "react"
import { useEffect } from "react"
import {useNavigate} from "react-router-dom"
import * as ROUTES from "../../Routes/UI"
import GetByCategories from "../../Lib/GetByCategories"


const MenuItems = ({categories})=>{
    const {data : menuData,loading,error} = GetByCategories(categories)
    const usenav = useNavigate()
    if(loading)
        return "loading"
    if(error){
        return "error"
    }
    return <div className="menu-items-container">
        {menuData.map((food,index) => <div key={index+100} className="food-item" onClick={()=>{
            usenav(ROUTES.GET_FOOD_DETAILS(food.id))
        }}>
           <img src={food.img} alt={food.title} />
             <div><p>  {food.title} </p> <p>{food.price}$</p></div>
        </div>)}
    </div> 
        
}

export default MenuItems 