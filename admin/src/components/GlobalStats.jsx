import Loading from "../components/Loading"
import Error from "../components/Error"
import { GetGlobalStats } from "../lib/Stats"
import LineChart from "./Charts/Line"

const GlobalStats = ()=>{
    const {data,loading,error} = GetGlobalStats()
    if( error)
        return <Error msg={"Error while retrieving Statistique for today "} error={error} />
    if( loading)
        return <Loading />
    return <>
    <DescNumbers data={data} />
    <LineChart  />
    </>
}
const DescNumbers = ({data})=>{
    
    return <div className="card-container">
        <div className="card-item">
            <img src="/growth-graph.png" alt="total income" />
            <div className="info">
                <h2>Total Income</h2>
                <p>{data.total}$</p>
            </div>
        </div>

        <div className="card-item make-green">
            <img src="/money-bag.png" alt="successful" />
            <div className="info">
                <h2>Success</h2>
                <p>{data.success}</p>
            </div>
        </div>

        <div className="card-item make-warning">
            <img src="/order-delivery.png" alt="orders" />
            <div className="info">
                <h2>Orders</h2>
                <p>{data.orders}</p>
            </div>
        </div>

        <div className="card-item make-red">
            <img src="/refund.png" alt="canceled" />
            <div className="info">
                <h2>Canceled</h2>
                <p>{data.canceled}</p>
            </div>
        </div>
    </div>
}
export default GlobalStats