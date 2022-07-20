import { useContext } from "react"
import { Navigate } from "react-router-dom"
import FoodInfo from "../../components/FoodInfo"
import {UserContext} from '../../contexts'
import * as ROUTES from "../../ROUTES"
const AddFood = ()=>{
    const user = useContext(UserContext)
    if(!user.profile.permissions.food.manage)
        return <Navigate to={ROUTES.FOOD.ALL} />
    return <FoodInfo />
}
export default AddFood
