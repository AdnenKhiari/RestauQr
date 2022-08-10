
import {ResponsiveLine,Line} from "@nivo/line"
import joi from "joi"
import { useCallback, useEffect, useMemo, useState } from "react"
import Loading from "../Loading"
import ChartContainer from "./ChartContainer"
const schema = joi.object({
    xmin: joi.number().optional().allow('').empty('').default(null),
    xmax: joi.number().optional().allow('').empty('').default(null),
    ymin: joi.number().optional().allow('').empty('').default(null),
    ymax: joi.number().optional().allow('').empty('').default(null),
    last: joi.number().optional().allow('').empty('').default(null)
})
const LineChart = ({rawdata,xTitle,yTitle,yaxisType,xaxisType})=>{


    const [processedData,setProcessedData] = useState(rawdata)

    const [chartProperties,setChartProperties] = useState({
        xmin: null,
        xmax: null,
        ymin: null,
        ymax: null
    }) 
    const [chartOptions,setChartOptions] = useState({
        xmin: null,
        xmax: null,
        ymin: null,
        ymax: null,
        last: null
    }) 

    const customOptions = useMemo(()=>{return {
        submit: (data)=>{
            console.log(data)
            setChartOptions({...data})
        },
        structure: [{
            label: "X Max",
            name: 'xmax',
            type: 'number'
        },
        {
            label: "X Min",
            name: 'xmin',
            type: 'number'
        },
        {
            label: "Y Max",
            name: 'ymax',
            type: 'number'
        },
        {
            label: "Y Min",
            name: 'ymin',
            type: 'number'
        },
        {
            label: "Show Last",
            name: 'last',
            type: 'number'   
        }]
    }},[setChartOptions])

    useEffect(()=>{
        
        const newprocessedData = structuredClone(rawdata)
        newprocessedData.forEach(element => {
            if(chartOptions.last)
                element.data = element.data.slice(-(chartOptions.last))
            element.data = element.data.map((dt)=>{

                if(chartOptions.last === null){
                    if(chartOptions.xmin && dt.x < chartOptions.xmin )
                        dt.x = null
                    if(chartOptions.xmax && dt.x > chartOptions.xmax )
                        dt.x = null
                    if(chartOptions.ymin && dt.y < chartOptions.ymin )
                        dt.y = chartOptions.ymin
                    if(chartOptions.ymax && dt.y > chartOptions.ymax )
                        dt.y = chartOptions.ymax
                }
  

                if(chartProperties.xmin === null || chartProperties.xmin > dt.x)
                    chartProperties.xmin = dt.x

                if(chartProperties.xmin === null || chartProperties.xmax < dt.x)
                    chartProperties.xmax = dt.x
                
                if(chartProperties.ymin === null || chartProperties.ymin > dt.y)
                    chartProperties.ymin = dt.y

                if(chartProperties.ymax === null || chartProperties.ymax < dt.y)
                    chartProperties.ymax = dt.y
                    
                return dt
            })
            //console.log(chartProperties)

        }); 
        setChartProperties(chartProperties)
        setProcessedData(newprocessedData)
    }, [chartOptions,rawdata])


    

    console.log(processedData)
    if(rawdata)
        return <ChartContainer xTitle={xTitle} yTitle={yTitle}  schema={schema} customOptions={customOptions} title='Hii lel' >
            <ResponsiveLine
                data={processedData}
                areaBaselineValue={chartOptions.ymin ||  Math.ceil(chartProperties.ymin*1.15) || 0}
                enableArea={true}
                yScale={{
                    type: yaxisType || 'linear', 
                    min: (chartOptions.last === null && chartOptions.ymin ) ||  Math.ceil( chartProperties.ymin*1.15) || 'auto',
                    max: (chartOptions.last === null && chartOptions.ymax ) ||  Math.ceil( chartProperties.ymax*1.15)  || 'auto',
                }}
                xFormat="time:%H:%M:%S"
                    xScale={{
                    type: xaxisType || 'linear',
                    min: (chartOptions.last === null && chartOptions.xmin ) ||  'auto',
                    max: (chartOptions.last === null && chartOptions.xmax ) ||  'auto',
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