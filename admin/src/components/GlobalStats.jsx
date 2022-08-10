import Loading from "../components/Loading"
import Error from "../components/Error"
import { GetGlobalStats } from "../lib/Stats"
import LineChart from "./Charts/Line"
import { useEffect, useState } from "react"
import BarChart from "./Charts/Bar"
import TimeSeriesOrders from "./TImeSeriesOrders"

const GlobalStats = ()=>{
    const [rawdata,setRawData] = useState([{
        id: 106,
        color: 'red',
        data:[
            {x:1,y:10},      
            {x:3,y:4},      
            {x:5,y:-1},      
            {x:6,y:4},      
            {x:7,y:8},      
            {x:8,y:4},  
        ]
    },
    {
        id: 104,
        color: 'dark',
        data:[
            {x:1,y:2},      
            {x:3,y:4},      
            {x:5,y:0},      
            {x:6,y:4},      
            {x:7,y:4},      
            {x:8,y:4},
        ]
    }
    ])  
    const {data: stats,loading,error} = GetGlobalStats()
    /*useEffect(()=>{
        const num = setInterval(()=>{
            rawdata[0].data.push({x:rawdata[0].data[rawdata[0].data.length - 1].x + 1,y: 5+ Math.random()*20})
            rawdata[1].data.push({x:rawdata[1].data[rawdata[1].data.length - 1].x + 1,y: 5+ Math.random()*20})
            setRawData([...rawdata])
        },1000)
        return ()=>clearInterval(num)
    },[])*/

    if( error)
        return <Error msg={"Error while retrieving Statistique for today "} error={error} />
    if( loading)
        return <Loading />
    return <>
    <DescNumbers data={stats} />
    <TimeSeriesOrders />
    {/*<LineChart rawdata={rawdata} xTitle={"values"} yTitle={"Leel"}  />*/}
  {/*  <BarChart rawdata={[
    {
        name: 'success',
        value: 55,
        color: 'red'
    },  
    {
        name: 'orsfdders',
        value: 70,
        color: 'red'
    },
    {
        name: 'ofdsfrders',
        value: 70,
        color: 'red'
    },    {
        name: 'ff',
        value: 70,
        color: 'red'
    },    {
        name: 'ofsdfrders',
        value: 70,
        color: 'red'
    },
    {
        name: 'canceled',
        value: 15,
        color: 'red'
    }]} 
    xTitle={"values"} 
    yTitle={"Leel"}
    indexby="name"
/>*/}
    </>
}



const DescNumbers = ({data})=>{
    
    return <div className="card-container">
        <div className="card-item">
            <img src="/growth-graph.png" alt="total income" />
            <div className="info">
                <h2>Total Income</h2>
                <p>{data.total || 0}$</p>
            </div>
        </div>

        <div className="card-item make-green">
            <img src="/money-bag.png" alt="successful" />
            <div className="info">
                <h2>Success</h2>
                <p>{data.success || 0}</p>
            </div>
        </div>

        <div className="card-item make-warning">
            <img src="/order-delivery.png" alt="orders" />
            <div className="info">
                <h2>Orders</h2>
                <p>{data.orders || 0}</p>
            </div>
        </div>

        <div className="card-item make-red">
            <img src="/refund.png" alt="canceled" />
            <div className="info">
                <h2>Canceled</h2>
                <p>{data.canceled || 0}</p>
            </div>
        </div>
    </div>
}
export default GlobalStats