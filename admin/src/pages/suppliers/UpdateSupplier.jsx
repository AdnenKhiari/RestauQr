import { Navigate, Routes, useParams } from "react-router-dom"
import SuppliersInfo from "../../components/SuppliersInfo"
import { GetSupplierById } from "../../lib/SuppliersDal"
import Loading from "../../components/Loading"
import Error from "../../components/Error"
import { getLevel } from "../../lib/utils"
import { useContext } from "react"
import { UserContext } from "../../contexts"

const UpdateSupplier = ()=>{
    const user = useContext(UserContext) 
    if(getLevel(user.profile.permissions.suppliers) < getLevel("manage") )
        return <Navigate to={Routes.SUPPLIERS.ALL} />
    return <UpdateSupplierUi />
}
const UpdateSupplierUi = ()=>{
    const {supplierid} = useParams()
    const {result,error,loading} = GetSupplierById(supplierid,true)
    console.log(result,error,loading)
    if(loading)
        return <Loading  />
    if(error)
        return <Error err={error} msg='Invalid ID' />
    return <SuppliersInfo defaultVals={result} />
}
export default UpdateSupplier
