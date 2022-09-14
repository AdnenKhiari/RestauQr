import { useParams } from "react-router-dom"
import SuppliersInfo from "../../components/SuppliersInfo"
import { GetSupplierById } from "../../lib/SuppliersDal"
import Loading from "../../components/Loading"
import Error from "../../components/Error"

const UpdateSupplier = ()=>{
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
