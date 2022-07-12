import UniversalTable from "../components/UniversalTable"
import {getFirestore,onSnapshot,collection,query,where,limit,startAfter,orderBy,documentId, FieldPath} from "firebase/firestore"
import { useCallback, useState } from "react"
import { useEffect } from "react"
import moment from "moment"
import {map_status_to_priority} from "../lib/utils"
import * as ROUTES from "../ROUTES"
import { useNavigate } from "react-router-dom"
const OrderTable = ({queryConstraints = []})=>{
    const page_lim = 10
    const db = getFirestore()
    //for the table of orders
    const [table_data,setTable_Data] = useState([[]])
    const [table_data_ref,setTable_Data_Ref] = useState([])
    //for the custom search
    const [searchdata,setSearchData] = useState(null)
    //for pagination
    const [last_nav,setLast_nav] = useState('next')
    //for pagination
    const [errormsg,setErrorMsg] = useState(null)
    //for navigation
    const usenav = useNavigate()



    //returns a custom query according to the search options
    const getBaseQuery = useCallback((customq = [orderBy("time",'desc')])=>{
        const cst = []
        if(searchdata){
            if(searchdata.id)
                return ([collection(db,'orders'),where(documentId(),'==', searchdata.id)])
            if(searchdata.tableid)
                cst.push(where('tableid','==',parseInt(searchdata.tableid)))
            if(searchdata.startDate)
                cst.push(where('time','>=',(moment(searchdata.startDate).toDate())))
            if(searchdata.endDate)
                cst.push(where('time','<=',(moment(searchdata.endDate).toDate())))
            }
        return ([collection(db,'orders'),...queryConstraints,...cst,...customq,limit(page_lim)])

    },[queryConstraints,db,searchdata])
    //TODO add usecallback

    //for the query of orders
    const [Query,setQuery] = useState(getBaseQuery())

    const rows = ['Order ID','Table ID','Count','Time','Status']
    const customOptions = {
        submit :  (data)=>{
            setSearchData({...data})
            setLast_nav('next')
            setQuery(getBaseQuery())
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

    const prev =()=>{
        if(!table_data_ref.length)
        return
        
        var index = table_data_ref.length - 1
        if(last_nav !== 'prev')
            index = 0
        setLast_nav('prev')   

        const last = table_data_ref[index]
        setQuery(getBaseQuery([orderBy("time",'asc'),startAfter(last)]))
    }
    const next =()=>{
        if(!table_data_ref.length)
            return
        console.log(table_data_ref)
        var index = table_data_ref.length - 1
        if(last_nav !== 'next')
            index = 0
        setLast_nav('next')
        const first = table_data_ref[index]
        setQuery(getBaseQuery([orderBy("time",'desc'),startAfter(first)]))
    }
    useEffect(()=>{
        
        const unsub = onSnapshot(query(...Query),(col)=>{ 
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
                new_table_data.forEach((data)=> data[3] = moment(data[3].toDate()).fromNow())

            setErrorMsg(null)
            if(new_table_data.length > 0)
                setTable_Data(new_table_data)
            if(col.docs.length > 0)
                setTable_Data_Ref(col.docs)
            else
                setErrorMsg("No Documents Found for the given query")

        })
        return unsub
    },[db,Query])

    return <div className="orders-table">
        <UniversalTable head={rows} body={table_data} colors={table_data[0].length > 0 && table_data.map((it)=>it[4].toLowerCase())} title="All Orders" oncl={(row)=>usenav(ROUTES.ORDERS.GET_REVIEW(row[0]))} prev={prev} next={next}  customOptions={customOptions}/>
        <p className="error">{errormsg}</p>
    </div>
}
export default OrderTable