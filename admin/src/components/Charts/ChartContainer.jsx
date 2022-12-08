import React from "react"
import {useForm} from "react-hook-form"
import {joiResolver} from "@hookform/resolvers/joi"
import joi from "joi"

import checkboximg from "../../images/checkbox.png"
import searchimg from "../../images/search.png"

const ChartContainer = ({children,schema,animate,xTitle,yTitle,title,customOptions})=>{
    const { register, handleSubmit, watch } = useForm({
        shouldUnregister: false,
        resolver: joiResolver(schema)
    });
    
    return <div className="chart">
        <div className="chart-options">

            { title && <h1>{title}</h1>}
            <div  className="options-container" >
                {customOptions && customOptions.structure && customOptions.structure.map((option,index)=><div key={index+100} className="option-item">
                    <label htmlFor={option.name}>{option.label}
                    {option.type === 'checkbox' && <img className={option.type === 'checkbox' ? (watch(option.name) ?"selected-box make-img-blue" : "selected-box " ) : undefined  } src={checkboximg} alt="checkbox" />}
                    </label>
                    <input id={option.name} type={option.type} {...register(option.name)} />
                </div> ) }
                {customOptions && customOptions.structure && <button onClick={handleSubmit(customOptions.submit)} type="submit"><img src={searchimg} alt="search" /></button >}
            </div>        
        </div>
        <div className="chart-container">
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
                legend: yTitle,
                legendOffset: -60,
                legendPosition: 'middle'
            },
            axisBottom: {
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: xTitle,
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
            animate: animate !== undefined ? animate : true,
            motionStiffness: 90,
            motionDamping: 15
        })}
        </div>

    </div>
}
export default ChartContainer