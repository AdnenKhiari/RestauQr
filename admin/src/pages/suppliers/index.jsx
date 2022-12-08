import AddSupplier from "./AddSupplier"
import UpdateSupplier from "./UpdateSupplier";
import AllSuppliers from "./AllSuppliers";
import ReviewSupplier from "./ReviewSupplier"
const SUPPLIERS = {
   Review: ReviewSupplier,
   All: AllSuppliers,
   Add: AddSupplier,
   Update: UpdateSupplier
}
export default SUPPLIERS