
import {where} from "firebase/firestore"
import SubOrderTable from "../../components/Tables/SubOrderTable"
const PendingOrders = ()=>{
    return <div className="orders">
        <SubOrderTable  title={"Pending Orders"} queryConstraints={[where('status','==','pending')]}  />
    </div>
}
export default PendingOrders