
import {where} from "firebase/firestore"
import SubOrderTable from "../../components/Tables/SubOrderTable"
const AccomplishedOrders = ()=>{
    return <div className="orders">
        <SubOrderTable title={"Accomplished Orders"} queryConstraints={[where('status','==','accomplished')]}  />
    </div>
}
export default AccomplishedOrders