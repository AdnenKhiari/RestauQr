import { useContext } from "react"
import { Navigate, useParams } from "react-router-dom"
import Error from "../../components/Error"
import Loading from "../../components/Loading"
import ProductOrdersInfo from "../../components/ProductOrdersInfo"
import {UserContext} from '../../contexts'
import { GetSupplierById } from "../../lib/SuppliersDal"
import { getLevel } from "../../lib/utils"
import * as ROUTES from "../../ROUTES"
const AddProductOrder = ()=>{
    const user = useContext(UserContext) 
    const {supplierid} = useParams()
    if(getLevel(user.profile.permissions.inventory) < getLevel("manage") )
        return <Navigate to={ROUTES.SUPPLIERS.ALL} />
    const suppinfo = GetSupplierById(supplierid)
    if(suppinfo.error)
        return <Error error={suppinfo.error} msg={"Error while retrieving supplier info "} />
    if(suppinfo.loading)
        return <Loading />
    return <ProductOrdersInfo supplierinfo={suppinfo.result} />
}
export default AddProductOrder
