import { useParams } from "react-router-dom"
import Error from "../../../components/Error"
import Loading from "../../../components/Loading"
import ProductOrderInfo from "../../../components/ProductOrderInfo"
import { GetProductOrderById } from "../../../lib/ProductsDal"

const UpdateProductOrder = ()=>{

    const {productid,orderid} = useParams()
    const {result : product,loading,error} = GetProductOrderById(productid,orderid)
    if( error)
        return <Error msg={"Error while retrieving Food information " + productid} error={error} />
    if( loading)
        return <Loading />
    return <ProductOrderInfo defaultVals={product}  productid ={productid} />
}
export default UpdateProductOrder