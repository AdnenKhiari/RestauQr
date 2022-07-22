
import OrderTable from "../../components/Tables/OrderTable"
import {where} from "firebase/firestore"
const WaitingOrders = ()=>{
    return <div className="orders">
        <OrderTable title={"Orders Waiting"} queryConstraints={[where('status','==','waiting')]}  />
    </div>
}
export default WaitingOrders