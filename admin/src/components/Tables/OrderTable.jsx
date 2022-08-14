import {getFirestore,onSnapshot,collection,query,where,limit,startAfter,orderBy,documentId, FieldPath} from "firebase/firestore"
import { useCallback, useState } from "react"
import { useEffect } from "react"
import moment from "moment"
import {formatFbDate, map_order_status_to_priority, map_status_to_priority} from "../../lib/utils"
import * as ROUTES from "../../ROUTES"
import * as APIROUTES from "../../APIROUTES"

import { useNavigate } from "react-router-dom"
import { FadeIn } from "../../animations"
import { motion } from "framer-motion"
import PaginatedUniversalTable from "../UniversalTable/PaginatedUniversalTable"
import joi from "joi"

const schema  = joi.object({
    tableid: joi.number().allow('').required().label("Table Id"),
    startDate: joi.date().allow('').required().label('Start Order Date'),
    endDate: joi.date().allow('').required().label('End Order Date')
})

const OrderTable = ({queryConstraints,title})=>{

    const page_lim = 10
    const rows = [
        {
            Header: 'Table ID',
            accessor: 'tableid'
        },
        {
            Header: 'Total Price',
            accessor: 'price',
            Cell : ({value}) => value + "$"
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
            type: "datetime-local",
            name: 'startDate',
            label: 'Start Date'
        },
        {
            type: "datetime-local",
            name: 'endDate',
            label: 'End Date'
        }]

    }

    const onDataQueried = (col)=>{
        const new_table_data = col.length > 0 && col.map((data)=>{
            return {id: data.id,time: data.time,tableid: data.tableid,price: data.price,status: data.status.toUpperCase()}
        }) 
        if(new_table_data)
            new_table_data.sort((a,b)=> {
                const o1 = map_order_status_to_priority(a.status)
                const o2 = map_order_status_to_priority(b.status)
                if(o1 === o2){
                    return o1.seconds - o2.seconds
                }
                return o1 - o2
            })
        console.log("NT",new_table_data)    
        return new_table_data
    }

    const usenav = useNavigate()
    return <PaginatedUniversalTable colname={'orders'} pagname="time" 
    rows={rows}  
    title={title} 
    cs_query={APIROUTES.ORDERS.GET_ORDERS}
    onDataQueried={onDataQueried} 
    onDataSubmit={customOptions.submit} 
    structure={customOptions.structure}   
    subscribe={true} 
    schema={schema}
    queryConstraints={queryConstraints}
    oncl = {(row)=>usenav(ROUTES.ORDERS.GET_REVIEW(row.id))}
    colors={(table_data)=> table_data.status.toLowerCase()}
    page_lim= {page_lim}        />
}
export default OrderTable