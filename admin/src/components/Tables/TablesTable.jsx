import joi from "joi"
import PaginatedUniversalTable from "../UniversalTable/PaginatedUniversalTable"
import {  documentId, where } from "firebase/firestore"
import moment from "moment"
import { useNavigate } from "react-router-dom"
import * as ROUTES from "../../ROUTES"
import { formatFbDate } from "../../lib/utils"
const schema  = joi.object({
    disabled: joi.bool().allow('').required().label("Disabled Only"),
    id: joi.string().allow('').required().label("Id"),
    placesNum: joi.number().allow('').label("Number Of Places"),
    startDate: joi.date().allow('').required().label('Start Purshase Date'),
    endDate: joi.date().allow('').required().label('End Purshase Date')
})

const TablesTable = ()=>{

    const usenav = useNavigate()
    const colname = 'tables'
    const rows = [{
        Header: 'Table ID',
        accessor: 'id'
    },
    {
        Header: 'Places Count',
        accessor: 'placesNum'
    },
    {
        Header: 'State',
        accessor: 'disabled',
        Cell : ({value})=>value ? "Disabled" : "Enabled"
    },
    {
        Header: 'Purshase Date',
        accessor: 'time',
        Cell : ({value})=> formatFbDate(value)
    },]
    //const rows = ['Table ID',"Places Count","Disabled","Purshase Date"]
    const customOptions = {
        submit: (data)=>{
            console.log(data)
        },
        structure: [{
            label: "Table Id",
            type: "number",
            name: "id" 
        },
        {
            label: "Number Of Places",
            type: "number",
            name: "placesNum" 
        },
        {
            label: "Only Disabled",
            type: "checkbox",
            name: "disabled" 
        },
        {
            label: "PurshaseDate Start",
            type: "datetime-local",
            name: "startDate" 
        },
        {
            label: "PurshaseDate End",
            type: "datetime-local",
            name: "endDate" 
        }
    ]
    }

    const onDataQueried = (col)=>{
        const res = []
        if(col.docs.length > 0){
            col.docs.forEach((table)=>{
                const table_data =  {
                    ...table.data(),
                    id: table.id
                }
                res.push(table_data)
            })
        }
        return res
    }

    const filterdata=(searchData,cst)=>{
        if(searchData.id){
            return [where(documentId(),'==',searchData.id)]
        }
        if(searchData.startDate)
            cst.push(where('time','>=',(moment(searchData.startDate).toDate())))
        if(searchData.endDate)
            cst.push(where('time','<=',(moment(searchData.endDate).toDate())))
        if(searchData.disabled)
            cst.push(where('disabled','==',true))
        if(searchData.placesNum)
            cst.push(where('placesNum','==',parseInt(searchData.placesNum)))
        return null
    }

    return <PaginatedUniversalTable colname={colname} 
        title='Tables' 
        rows={rows}
        structure ={customOptions.structure} 
        onDataSubmit={customOptions.submit}
        filterData={filterdata}
        pagname = {'time'}
        subscribe={false}
        schema={schema}
        onDataQueried={onDataQueried}
        oncl={(dt)=>usenav(ROUTES.TABLES.GET_REVIEW(dt.id))}
        />
    
}   
export default TablesTable