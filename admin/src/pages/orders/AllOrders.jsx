
import OrderTable from "../../components/OrderTable"
import {where} from "firebase/firestore"
const AllOrders = ()=>{
    return <div className="orders">
        <OrderTable title={"All Orders"} /*queryConstraints={[where('status','==','pending')]}*/  />
    </div>
}
export default AllOrders