import ProductsDetails from "../../components/ProductsInfo"
import { useParams } from "react-router-dom"
import Loading from "../../components/Loading"
import Error from "../../components/Error"
import { GetProductTemplateById } from "../../lib/ProductTemplates"
import ProductTemplateDetails from "../../components/ProductTemplatesInfo.jsx"

const AddProductTemplate = ()=>{
    return <ProductTemplateDetails  />
}

export default AddProductTemplate