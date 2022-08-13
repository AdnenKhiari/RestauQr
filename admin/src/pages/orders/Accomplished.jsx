
import SubOrderTable from "../../components/Tables/SubOrderTable"
const AccomplishedOrders = ()=>{
    return <div className="orders">
        <SubOrderTable title={"Accomplished Orders"} queryConstraints={{status: 'accomplished'}}  />
    </div>
}
export default AccomplishedOrders