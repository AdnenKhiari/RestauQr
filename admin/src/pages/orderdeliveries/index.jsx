import AddOrderDeliveries from "./AddOrderDeliveries"
import UpdateOrderDeliveries from "./UpdateOrderDeliveries";
import AllOrderDeliveries from "./AllOrderDeliveries";
import ReviewOrderDeliveries from "./ReviewOrderDeliveries"
const SUPPLIERS = {
   Review: ReviewOrderDeliveries,
   All: AllOrderDeliveries,
   Add: AddOrderDeliveries,
   Update: UpdateOrderDeliveries
}
export default SUPPLIERS