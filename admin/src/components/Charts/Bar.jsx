
import {ResponsiveBar,Bar} from "@nivo/bar"
import joi from "joi"
import { useCallback, useEffect, useMemo, useState } from "react"
import Loading from "../Loading"
import ChartContainer from "./ChartContainer"

const BarChart = ({xTitle, yTitle,rawdata,hue,colors,indexby})=>{

    const [processedData,setProcessedData] = useState(rawdata)

    const [chartProperties,setChartProperties] = useState({
        
    }) 
    const [chartOptions,setChartOptions] = useState({
        
    }) 

    useEffect(()=>{
        const newprocessedData = structuredClone(rawdata)
        setChartProperties(chartProperties)
        setProcessedData(newprocessedData)
    }, [chartOptions,rawdata])

    if(rawdata)
        return <ChartContainer xTitle={xTitle} yTitle={yTitle} title='Bar lel' >
            <ResponsiveBar
                data={processedData}
                isInteractive={true}
                useMesh={true}
                indexBy={indexby}
                colorBy={"indexValue"}    
                onClick={(e)=>console.log(e)}
            />
  </ChartContainer>
        
    return <Loading />
}
export default BarChart