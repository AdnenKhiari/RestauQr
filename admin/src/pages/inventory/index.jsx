import AllProducts from "./AllProducts"
import ReviewProduct from "./ReviewProduct"
import AddProduct from "./AddProduct"
import UpdateProduct from "./UpdateProduct"
import Marchandise from "./Marchandise"
import AddUpdateTemplate from "./AddUpdateTemplate"

const Inventory = {
    AllProducts,
    ReviewProduct,
    AddProduct,
    UpdateProduct,
    Marchandise,
    TEMPLATES: {
        AddUpdate:AddUpdateTemplate,
    }
}
export default Inventory