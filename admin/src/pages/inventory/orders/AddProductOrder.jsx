import { useParams } from "react-router-dom"
import ProductOrderInfo from "../../../components/ProductOrderInfo"
const AddProductOrder = ()=>{
    
    const {productid} = useParams()
    return <ProductOrderInfo productid={productid} />
}
export default AddProductOrder