
import OrderTable from "../../components/Tables/OrderTable"
import {where} from "firebase/firestore"
const CanceledOrders = ()=>{
    return <div className="orders">
        <OrderTable title={"Canceled Orders"} queryConstraints={[where('status','==','canceled')]}  />
    </div>
}
export default CanceledOrders