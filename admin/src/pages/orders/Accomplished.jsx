
import OrderTable from "../../components/Tables/OrderTable"
import {where} from "firebase/firestore"
const AccomplishedOrders = ()=>{
    return <div className="orders">
        <OrderTable title={"Accomplished Orders"} queryConstraints={[where('status','==','accomplished')]}  />
    </div>
}
export default AccomplishedOrders