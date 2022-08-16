import { useContext } from "react"
import { Navigate } from "react-router-dom"
import FoodInfo from "../../components/FoodInfo"
import {UserContext} from '../../contexts'
import { getLevel } from "../../lib/utils"
import * as ROUTES from "../../ROUTES"
const AddFood = ()=>{
    const user = useContext(UserContext) 
    if(getLevel(user.profile.permissions.food) < getLevel("manage") )
        return <Navigate to={ROUTES.FOOD.ALL} />
    return <FoodInfo />
}
export default AddFood
