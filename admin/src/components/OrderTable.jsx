import UniversalTable from "../components/UniversalTable"
import {getFirestore,onSnapshot,collection,query,where,limit,startAfter,orderBy,documentId, FieldPath} from "firebase/firestore"
import { useCallback, useState } from "react"
import { useEffect } from "react"
import moment from "moment"
import {map_status_to_priority} from "../lib/utils"
import * as ROUTES from "../ROUTES"
import { useNavigate } from "react-router-dom"
import { FadeIn } from "../animations"
import { motion } from "framer-motion"
import PaginatedUniversalTable from "./UniversalTable/PaginatedUniversalTable"

const OrderTable = ({queryConstraints,title})=>{

    const page_lim = 10
    const pagname = 'time'
    const colname ='orders'

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
            new_table_data.forEach((data)=> data[3] = moment(data[3].toDate()).format("YYYY-MM-DD - hh:mm:ss"))
        return new_table_data
    }

    const filterData = (searchdata)=>{

        const cst = []
        if(searchdata.id)
            return ([where(documentId(),'==', searchdata.id)])
        if(searchdata.tableid)
            cst.push(where('tableid','==',parseInt(searchdata.tableid)))
        if(searchdata.startDate)
            cst.push(where('time','>=',(moment(searchdata.startDate).toDate())))
        if(searchdata.endDate)
            cst.push(where('time','<=',(moment(searchdata.endDate).toDate())))
        return cst
    }
    return <PaginatedUniversalTable colname={'orders'} pagname="time" 
    rows={rows}  
    title={title} 
    filterData={filterData} 
    onDataQueried={onDataQueried} 
    onDataSubmit={customOptions.submit} 
    structure={customOptions.structure}   
    subscribe={true} 
    queryConstraints={queryConstraints}        />
}
export default OrderTable