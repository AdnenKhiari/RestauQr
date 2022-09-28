import AddProductOrder from "./AddProductOrder"
import UpdateProductOrders from "./UpdateProductOrders";
import AllProductOrders from "./AllProductOrders";
import ReviewProductOrders from "./ReviewProductOrders"
const SUPPLIERS = {
   Review: ReviewProductOrders,
   All: AllProductOrders,
   Add: AddProductOrder,
   Update: UpdateProductOrders
}
export default SUPPLIERS