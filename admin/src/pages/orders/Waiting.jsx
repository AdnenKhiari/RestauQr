
import {where} from "firebase/firestore"
import SubOrderTable from "../../components/Tables/SubOrderTable"
const WaitingOrders = ()=>{
    return <div className="orders">
        <SubOrderTable title={"Orders Waiting"} queryConstraints={{status: 'waiting'}}  />
    </div>
}
export default WaitingOrders