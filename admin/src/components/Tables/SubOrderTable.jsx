import {getFirestore,onSnapshot,collection,query,where,limit,startAfter,orderBy,documentId, FieldPath} from "firebase/firestore"
import { useCallback, useState } from "react"
import { useEffect } from "react"
import moment from "moment"
import {formatFbDate, map_status_to_priority} from "../../lib/utils"
import * as ROUTES from "../../ROUTES"
import { useNavigate } from "react-router-dom"
import { FadeIn } from "../../animations"
import { motion } from "framer-motion"
import PaginatedUniversalTable from "../UniversalTable/PaginatedUniversalTable"
import joi from "joi"
import * as APIROUTES from "../../APIROUTES"

const schema  = joi.object({
    tableid: joi.number().allow('').required().label("Table Id"),
    id: joi.string().allow('').required().label("Id"),
    startDate: joi.date().allow('').required().label('Start Order Date'),
    endDate: joi.date().allow('').required().label('End Order Date')
})

const SubOrderTable = ({queryConstraints,title})=>{

    const page_lim = 10
    const rows = [
        {
            Header: 'Table ID',
            accessor: 'tableid'
        },
        {
            Header: 'Food Count',
            accessor: 'foodcount'
  
        },
        {
            Header: 'Time',
            accessor: 'time',
            Cell : ({value})=>formatFbDate(value)
        },
        {
            Header: 'Status',
            accessor: 'status'
        }
    ]

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
        const new_table_data = col.length > 0 && col.map((data)=>{
            return {id: data.id,orderid: data.order_ref,time: data.time,tableid: data.tableid,foodcount: (data.food && data.food.length) || 0,status: data.status.toUpperCase()}
        }) 
        if(new_table_data)
            new_table_data.sort((a,b)=> {
                const o1 = map_status_to_priority(a.status)
                const o2 = map_status_to_priority(b.status)
                if(o1 === o2){
                    return o1.seconds - o2.seconds
                }
                return o1 - o2
            })
        console.log("NT",new_table_data)    
        return new_table_data
    }


    const usenav = useNavigate()
    return <PaginatedUniversalTable colname={'sub_orders'} pagname="time" 
    rows={rows}  
    title={title} 
    custom_key="lastOrderRef"
    custom_val="order_ref"
    onDataQueried={onDataQueried} 
    cs_query={APIROUTES.ORDERS.SUB_ORDERS.GET_SUB_ORDERS}
    onDataSubmit={customOptions.submit} 
    structure={customOptions.structure}   
    subscribe={true} 
    group={true}
    schema={schema}
    queryConstraints={queryConstraints}
    oncl = {(row)=>usenav(ROUTES.ORDERS.GET_SUBREVIEW(row.orderid,row.id))}
    colors={(table_data)=> table_data.status.toLowerCase()}
    page_lim= {page_lim}        />
}
export default SubOrderTable