import { useContext } from "react"
import { Navigate } from "react-router-dom"
import ProductOrdersTables from "../../components/Tables/ProductOrdersTable.jsx"
import { UserContext } from "../../contexts/index.jsx"
import { getLevel } from "../../lib/utils.js"
import * as ROUTES from "../../ROUTES"
const AllProductOrders = ()=>{
    const user = useContext(UserContext)
    if(getLevel(user.profile.permissions.inventory) < getLevel("read") )
        return <Navigate to={ROUTES.SUPPLIERS.ALL} />
    return <ProductOrdersTables title="All Orders" />
}
export default AllProductOrders