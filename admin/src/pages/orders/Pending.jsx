
import OrderTable from "../../components/OrderTable"
import {where} from "firebase/firestore"
const PendingOrders = ()=>{
    return <div className="orders">
        <OrderTable  title={"Pending Orders"} queryConstraints={[where('status','==','pending')]}  />
    </div>
}
export default PendingOrders