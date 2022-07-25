import { joiResolver } from "@hookform/resolvers/joi";
import {useForm} from "react-hook-form"
import Error from "../Error";
import Loading from "../Loading";
import {useTable,useSortBy} from "react-table"

const UniversalTable = ({title,head,body,errs,colors,oncl,prev,next,customOptions,schema})=>{

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable({
        data: body,
        columns: head
    },useSortBy)
    const { register, handleSubmit, watch } = useForm({
        shouldUnregister: false,
        resolver: joiResolver(schema)
    });
    console.log(errs,body,head)
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
            body && <table {...getTableProps()}>
            <thead>
                {head && headerGroups.map((headGroup )=><tr {...headGroup.getHeaderGroupProps()}>
                    {headGroup.headers.map((column)=><th {...column.getHeaderProps(column.getSortByToggleProps())} >
                        <div className="header-tag">
                        {column.render('Header')}
                        {column.isSortedDesc !== undefined && (column.isSortedDesc ? <img style={{transform: "rotate(180deg)"}} src="/upload.png" alt="uparrow" /> : <img  src="/upload.png" alt="uparrow" />) }
                        </div>
                    </th>)}
                </tr>)}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row)=>{
                    prepareRow(row)
                    return <tr className={colors ? colors(row.original) : undefined} {...row.getRowProps()} onClick={(e)=>oncl(row.original)}>
                        {row.cells.map(cell => <td {...cell.getCellProps()} >{cell.render('Cell')}</td> )}
                    </tr>
                })}
            </tbody>
        </table>
        }
        {errs && <Error error={errs} msg={errs.msg}/>}

    </div>
}

export default UniversalTable
