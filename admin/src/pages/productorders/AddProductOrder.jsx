import { useContext } from "react"
import { Navigate } from "react-router-dom"
import SuppliersInfo from "../../components/SuppliersInfo.jsx"
import {UserContext} from '../../contexts'
import { getLevel } from "../../lib/utils"
import * as ROUTES from "../../ROUTES"
const AddProductOrder = ()=>{
    const user = useContext(UserContext) 
    if(getLevel(user.profile.permissions.food) < getLevel("manage") )
        return <Navigate to={ROUTES.SUPPLIERS.ALL} />
    return <SuppliersInfo />
}
export default AddProductOrder
