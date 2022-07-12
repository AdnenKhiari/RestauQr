
import OrderTable from "../../components/OrderTable"
import {where} from "firebase/firestore"
const WaitingOrders = ()=>{
    return <div className="orders">
        <OrderTable queryConstraints={[where('status','==','waiting')]}  />
    </div>
}
export default WaitingOrders