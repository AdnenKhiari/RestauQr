import { useContext } from "react"
import { Navigate } from "react-router-dom"
import TableInfo from "../../components/TableInfo"
import {UserContext} from '../../contexts'
import { getLevel } from "../../lib/utils"
import * as ROUTES from "../../ROUTES"
const AddTable = ()=>{
    const user = useContext(UserContext)
    if(getLevel(user.profile.permissions.tables) <= getLevel("manage"))
        return <Navigate to={ROUTES.TABLES.ALL} />
    return <TableInfo />
}
export default AddTable
