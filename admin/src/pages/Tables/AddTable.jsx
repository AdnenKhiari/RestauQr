import { useContext } from "react"
import { Navigate } from "react-router-dom"
import TableInfo from "../../components/TableInfo"
import {UserContext} from '../../contexts'
import * as ROUTES from "../../ROUTES"
const AddTable = ()=>{
    const user = useContext(UserContext)
    if(!user.profile.permissions.tables.manage)
        return <Navigate to={ROUTES.TABLES.ALL} />
    return <TableInfo />
}
export default AddTable
