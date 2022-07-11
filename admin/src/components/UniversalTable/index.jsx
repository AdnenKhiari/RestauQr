import { useState } from "react"
import {useForm} from "react-hook-form"

const UniversalTable = ({title,head,body,colors,prev,next})=>{

    return  <div className="universal-table">
        <div className="table-header">
        { title && <h1>{title}</h1>}
            <div className="table-options" >
                <button onClick={(e)=>prev()}><img src="/back.png" alt="prev" /></button>
                <input type="number" name="Number" id="Number" min={0}/>
                <button onClick={(e)=>next()}><img src="/next.png" alt="next" /></button>
                <button type="submit">Find</button>
            </div>
        </div>
        <table>
            <thead>
                <tr>
                    {head && head.map((item,key)=><th key={item}>{item}</th>)}
                </tr>
            </thead>
            <tbody>
                {body && body.map((item,key)=><tr className={(colors && colors[key] ) || undefined } key={key}>
                    {body[key].map((data,data_ind) => <td key={key * head.length + data_ind}>{data}</td>)}
                </tr>)}
            </tbody>
        </table>
    </div>
}
export default UniversalTable