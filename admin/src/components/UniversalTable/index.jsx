import { useState } from "react"
import {useForm} from "react-hook-form"

const UniversalTable = ({title,head,body,colors,oncl,prev,next,customOptions})=>{

    const { register, handleSubmit, watch } = useForm({
        shouldUnregister: false
    });

    return  <div className="universal-table">
        <div className="table-header">
            { title && <h1>{title}</h1>}
            <div  className="table-options" >
                {customOptions && customOptions.structure && customOptions.structure.map((option,index)=><div className="option-item">
                    <label htmlFor={option.name}>{option.label}</label>
                    <input id={option.name} type={option.type} {...register(option.name)} />
                </div> ) }
                <button onClick={(e)=>prev()}><img src="/back.png" alt="prev" /></button>
                {customOptions && customOptions.structure && <button onClick={handleSubmit(customOptions.submit)} type="submit"><img src="/search.png" alt="search" /></button >}
                <button onClick={(e)=>next()}><img src="/next.png" alt="next" /></button>
            </div>
        </div>
        <table>
            <thead>
                <tr>
                    {head && head.map((item,key)=><th key={item}>{item}</th>)}
                </tr>
            </thead>
            <tbody>
                {body && body.map((item,key)=><tr onClick={(e)=>oncl(item)} className={(colors && colors[key] ) || undefined } key={key}>
                    {body[key].map((data,data_ind) => <td key={key * head.length + data_ind}>{data}</td>)}
                </tr>)}
            </tbody>
        </table>
    </div>
}
export default UniversalTable