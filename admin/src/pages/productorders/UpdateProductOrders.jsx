import { Navigate, useParams } from "react-router-dom"
import ProductOrdersInfo from "../../components/ProductOrdersInfo"
import { GetSupplierById } from "../../lib/SuppliersDal"
import Loading from "../../components/Loading"
import Error from "../../components/Error"
import {GetProductOrdersById} from "../../lib/ProductOrdersDal"
import { useContext } from "react"
import {UserContext} from '../../contexts'
import { getLevel } from "../../lib/utils"
import * as ROUTES from "../../ROUTES"

const UpdateProductOrder = ()=>{
    const user = useContext(UserContext) 

    const {supplierid,orderid} = useParams()
    if(getLevel(user.profile.permissions.inventory) < getLevel("manage") )
        return <Navigate to={ROUTES.SUPPLIERS.ALL} />
    const productorderinfo = GetProductOrdersById(supplierid,orderid)
    const {result,error,loading} = GetSupplierById(supplierid,true)
    console.log(result,error,loading)
    if(loading || productorderinfo.loading )
        return <Loading  />
    if(error || productorderinfo.error)
        return <>
            {<Error err={error} msg='Invalid ID' />}
            {<Error error={productorderinfo.error} msg={"Error while retrieving Products Orders info "} />}
        </>

    return <ProductOrdersInfo supplierinfo={result} defaultVals={productorderinfo.result} />
}
export default UpdateProductOrder
