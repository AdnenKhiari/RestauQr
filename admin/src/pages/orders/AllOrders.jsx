import UniversalTable from "../../components/UniversalTable"
import {getFirestore,onSnapshot,collection,query,doc,limit,startAt,orderBy} from "firebase/firestore"
import { useCallback, useState } from "react"
import { useEffect } from "react"
import moment from "moment"
import {map_status_to_priority} from "../../lib/utils"
const AllOrders = ()=>{
    const db = getFirestore()
    const [table_data,setTable_Data] = useState([[]])
    const [pageNum,setPageNum] = useState(0)
    console.log(pageNum)
    useEffect(()=>{
        const unsub = onSnapshot(query(collection(db,'orders'),orderBy("time"),limit(3)),(col)=>{ 
            const new_table_data = col.docs.map((document)=>{
                const id = document.id
                const data = document.data()
                console.log(data)
                return [id,"#"+data.tableid,data.food.length,moment(data.time.toDate()).fromNow(), data.status.toUpperCase()]
            })
            new_table_data.sort((a,b)=> {
                const o1 = map_status_to_priority(a[4])
                const o2 = map_status_to_priority(b[4])
                return o1 - o2
            })
            console.log(new_table_data)
            setTable_Data(new_table_data)
        })
        return unsub
    },[db,pageNum])
    const rows = ['Order ID','Table ID','Count','Time','Status']
    return <div className="orders">
        <UniversalTable head={rows} body={table_data} colors={table_data[0].length > 0 && table_data.map((it)=>it[4].toLowerCase())} title="All Orders" submit={(data)=>setPageNum(data)} />
    </div>
}
export default AllOrders