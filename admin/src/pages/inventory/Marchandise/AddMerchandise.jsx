import { useParams } from "react-router-dom"
import MerchandiseInfo from "../../../components/MerchandiseInfo"
const AddMerchandise= ()=>{
    
    const {productid} = useParams()
    return <MerchandiseInfo productid={productid} />
}
export default AddMerchandise