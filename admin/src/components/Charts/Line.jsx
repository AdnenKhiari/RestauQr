import {ResponsiveLine,Line} from "@nivo/line"
import { useEffect, useState } from "react"
import AutoSizer from "react-virtualized-auto-sizer"
import Loading from "../Loading"
import ChartContainer from "./ChartContainer"

const LineChart = ()=>{
    const [data,setData] = useState([{
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
    useEffect(()=>{
        const num = setInterval(()=>{
            data[0].data.push({x:data[0].data[data[0].data.length - 1].x + 1,y: 4})
            data[1].data.push({x:data[1].data[data[1].data.length - 1].x + 1,y: 6})

            setData([...data])
        },1000)
        return ()=>clearInterval(num)
    },[])


    console.log(data.map((item)=>{item.data = item.data.slice(-15);return item}))
    if(data)
        return <ChartContainer >
    <ResponsiveLine
        data={data.map((item)=>{item.data = item.data.slice(-15);return item})}
        enableArea={true}
        yScale={{
        type: 'linear',
        min: 0,
        max: 10     
        }}
        pointSize={10}
        curve="natural"
        lineWidth={3}
        isInteractive={true}
        useMesh={true}
        pointLabelYOffset={10}
  />
  </ChartContainer>
        
    return <Loading />
}
export default LineChart