import { joiResolver } from "@hookform/resolvers/joi";
import {useForm} from "react-hook-form"
import Error from "../Error";
import Loading from "../Loading";

const UniversalTable = ({title,head,body,errs,colors,oncl,prev,next,customOptions,schema})=>{

    const { register, handleSubmit, watch } = useForm({
        shouldUnregister: false,
        resolver: joiResolver(schema)
    });
    console.log(errs)
    return  <div className="universal-table">
        <div className="table-header">
            { title && <h1>{title}</h1>}
            <div  className="table-options" >
                {customOptions && customOptions.structure && customOptions.structure.map((option,index)=><div key={index+100} className="option-item">
                    <label htmlFor={option.name}>{option.label}
                    <img className={option.type === 'checkbox' ? (watch(option.name) ?"selected-box make-img-blue" : "selected-box " ) : undefined  } src="/checkbox.png" alt="checkbox" />

                    </label>
                    <input id={option.name} type={option.type} {...register(option.name)} />
                </div> ) }
                <button onClick={(e)=>prev()}><img src="/back.png" alt="prev" /></button>
                {customOptions && customOptions.structure && <button onClick={handleSubmit(customOptions.submit)} type="submit"><img src="/search.png" alt="search" /></button >}
                <button onClick={(e)=>next()}><img src="/next.png" alt="next" /></button>
            </div>
        </div>
        {!errs && !body && <Loading />}
        {
            body && <table>
            <thead>
                <tr>
                    {head && head.map((item,key)=><th key={item}>{item}</th>)}
                </tr>
            </thead>
            <tbody>
                {body && body.map((item,key)=><tr onClick={(e)=>oncl(item)} className={(colors && colors(body) && colors(body)[key] ) || undefined } key={key}>
                    {body[key].map((data,data_ind) => <td key={key * head.length + data_ind}>{data}</td>)}
                </tr>)}
            </tbody>
        </table>
        }
        {errs && <Error error={errs} msg={errs.msg}/>}

    </div>
}

export default UniversalTable
