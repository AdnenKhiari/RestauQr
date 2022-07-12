
import OrderTable from "../../components/OrderTable"
import {where} from "firebase/firestore"
const AllOrders = ()=>{
    return <div className="orders">
        <OrderTable /*queryConstraints={[where('status','==','pending')]}*/  />
    </div>
}
export default AllOrders