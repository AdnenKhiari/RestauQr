import UniversalTable from "../components/UniversalTable"
import {getFirestore,onSnapshot,collection,query,where,limit,startAfter,orderBy,documentId, FieldPath} from "firebase/firestore"
import { useCallback, useState } from "react"
import { useEffect } from "react"
import moment from "moment"
import {formatFbDate, map_status_to_priority} from "../lib/utils"
import * as ROUTES from "../ROUTES"
import { useNavigate } from "react-router-dom"
import { FadeIn } from "../animations"
import { motion } from "framer-motion"
import PaginatedUniversalTable from "./UniversalTable/PaginatedUniversalTable"
import joi from "joi"

const schema  = joi.object({
    tableid: joi.number().allow('').required().label("Table Id"),
    id: joi.string().allow('').required().label("Id"),
    startDate: joi.date().allow('').required().label('Start Order Date'),
    endDate: joi.date().allow('').required().label('End Order Date')
})

const OrderTable = ({queryConstraints,title})=>{

    const page_lim = 10

    const rows = ['Order ID','Table ID','Count','Time','Status']
    const customOptions = {
        submit :  (data)=>{
            console.log(data)
        },
        structure: [
        {
            type: "number",
            name: 'tableid',
            label: 'Table ID'
        },
        {
            type: "text",
            name: 'id',
            label: 'Order ID'
        },
        {
            type: "datetime-local",
            name: 'startDate',
            label: 'Start Date'
        },{
            type: "datetime-local",
            name: 'endDate',
            label: 'End Date'
        }]

    }

    const onDataQueried = (col)=>{
        const new_table_data = col.docs.length > 0 && col.docs.map((document)=>{
            const id = document.id
            const data = document.data()
            console.log(data)
            return [id,"#"+data.tableid,data.food.length,(data.time), data.status.toUpperCase()]
        }) 
        if(new_table_data)
            new_table_data.sort((a,b)=> {
                const o1 = map_status_to_priority(a[4])
                const o2 = map_status_to_priority(b[4])
                if(o1 === o2){
                    return o1.seconds - o2.seconds
                }
                return o1 - o2
            })
            
        if(new_table_data && new_table_data.length > 0)
            new_table_data.forEach((data)=> data[3] = formatFbDate(data[3]))
        return new_table_data
    }

    const filterData = (searchdata,cst)=>{

        if(searchdata.id)
            return ([where(documentId(),'==', searchdata.id)])
        if(searchdata.tableid)
            cst.push(where('tableid','==',parseInt(searchdata.tableid)))
        if(searchdata.startDate)
            cst.push(where('time','>=',(moment(searchdata.startDate).toDate())))
        if(searchdata.endDate)
            cst.push(where('time','<=',(moment(searchdata.endDate).toDate())))
        return null
    }
    const usenav = useNavigate()
    return <PaginatedUniversalTable colname={'orders'} pagname="time" 
    rows={rows}  
    title={title} 
    filterData={filterData} 
    onDataQueried={onDataQueried} 
    onDataSubmit={customOptions.submit} 
    structure={customOptions.structure}   
    subscribe={true} 
    schema={schema}
    queryConstraints={queryConstraints}
    oncl = {(row)=>usenav(ROUTES.ORDERS.GET_REVIEW(row[0]))}
    colors={(table_data)=> table_data[0].length > 0 && table_data.map((it)=>it[4].toLowerCase())}
    page_lim= {page_lim}        />
}
export default OrderTable