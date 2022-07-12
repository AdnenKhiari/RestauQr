
import OrderTable from "../../components/OrderTable"
import {where} from "firebase/firestore"
const CanceledOrders = ()=>{
    return <div className="orders">
        <OrderTable queryConstraints={[where('status','==','canceled')]}  />
    </div>
}
export default CanceledOrders