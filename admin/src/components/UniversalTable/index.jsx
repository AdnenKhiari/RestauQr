import { useState } from "react"
import {useForm} from "react-hook-form"
const max = (a,b)=>{
    return a > b ? a : b
}
const UniversalTable = ({title,head,body,colors})=>{
     const { register, handleSubmit, watch,setValue } = useForm({
        defaultValues: {
            pagenum: 0
        }
     });
        
    return  <div className="universal-table">
        <div className="table-header">
        { title && <h1>{title}</h1>}
            <form className="table-options" onSubmit={handleSubmit((data)=>submit(data.pagenum))}>
                <button onClick={(e)=>setValue('pagenum',max(0,parseInt(watch('pagenum'))-1))}><img src="/back.png" alt="prev" /></button>
                {/*<input type="number" name="Number" id="Number" {...register("pagenum",{min: 0})} /> */ }
                <button onClick={(e)=>setValue('pagenum',parseInt(watch('pagenum'))+1)}><img src="/next.png" alt="next" /></button>
                <button type="submit">Find</button>
            </form>
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