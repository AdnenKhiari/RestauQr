
import SubOrderTable from "../../components/Tables/SubOrderTable"
import {where} from "firebase/firestore"
const CanceledOrders = ()=>{
    return <div className="orders">
        <SubOrderTable title={"Canceled Orders"} queryConstraints={{status: 'canceled'}}  />
    </div>
}
export default CanceledOrders