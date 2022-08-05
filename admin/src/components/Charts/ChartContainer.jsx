import React from "react"
const ChartContainer = ({children})=>{
    return <div className="chart-container">
        {React.cloneElement(children,{
            theme: {
                fontFamily: 'Open Sans',
                fontSize: 15,
                axis: {
                    legend: {
                        text: {
                            fontSize: 25,  
                            margin: 20                  
                        }
                    }
                }
            },
            colors: {scheme: "pastel2"},
            margin: {
                bottom: 90,
                left: 90,
                right: 140,
                top: 70
            },
            axisLeft: {
                tickPadding: 5,
                tickRotation: 0,
                legend: 'count',
                legendOffset: -60,
                legendPosition: 'middle'
            },
            axisBottom: {
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Ahla',
                legendOffset: 60,
                legendPosition: 'middle'
            },
            legends: [
                {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 40,
                itemOpacity: 0.75,
                symbolSize: 30,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                    {
                    on: 'hover',
                    style: {
                        itemBackground: 'rgba(0, 0, 0, .03)',
                        itemOpacity: 1
                    }
                    }
                ]
                }
            ],
            animate: true,
            motionStiffness: 90,
            motionDamping: 15
        })}
    </div>
}
export default ChartContainer