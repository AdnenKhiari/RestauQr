import GlobalStats from "../components/GlobalStats"
import OrderTable from "../components/Tables/OrderTable"
const DashBoard = ()=>{
    return <>
    <GlobalStats />
    <OrderTable title="All Orders" />
    </>
}
export default DashBoard