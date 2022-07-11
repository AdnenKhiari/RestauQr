const UniversalTable = ({title,head,body})=>{
    return <div className="universal-table">
        <h1>{title}</h1>
        <table>
            <thead>
                <tr>
                    {head && head.map((item,key)=><th key={item}>{item}</th>)}
                </tr>
            </thead>
            <tbody>
                {body && body.map((item,key)=><tr key={key}>
                    {body[key].map((data,data_ind) => <td key={key * head.length + data_ind}>{data}</td>)}
                </tr>)}
            </tbody>
        </table>
    </div>
}
export default UniversalTable