import { GetLast24hOrders } from "../lib/Stats"
import Loading from "../components/Loading"
import Error from "../components/Error"
import LineChart from "./Charts/Line"
import moment from "moment"
const format_data = (data,title)=>{
    const res = []
    if(data && data.length > 0){
        let total = 0

        res.push({
            id: title || 'Curve',
            data : data.map((dt)=>{
                total += dt.foodcount
                return {
                    x:  dt.date.toDate(),
                    y: total    
                }
            })
        })
    }
    return res
}
const TimeSeriesOrders = ()=>{
    const {data,error,loading} =  GetLast24hOrders()
    
    console.log(data,format_data(data),error,loading)
    if( error)
        return <Error msg={"Error while retrieving Statistique for today "} error={error} />
    if( loading)
        return <Loading />
    return <LineChart rawdata={format_data(data,'Food Served')}  xTitle={"Time"} yTitle={"Food Count"}  />
}

export default TimeSeriesOrders