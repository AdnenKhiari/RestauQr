import AllProducts from "./AllProducts"
import ReviewProduct from "./ReviewProduct"
import AddProduct from "./AddProduct"
import UpdateProduct from "./UpdateProduct"
import Marchandise from "./Marchandise"
import AddTemplate from "./AddTemplate"
import UpdateTemplate from "./UpdateTemplate"

const Inventory = {
    AllProducts,
    ReviewProduct,
    AddProduct,
    UpdateProduct,
    Marchandise,
    TEMPLATES: {
        Add: AddTemplate,
        Update: UpdateTemplate
    }
}
export default Inventory