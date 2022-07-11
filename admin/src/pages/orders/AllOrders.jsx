import UniversalTable from "../../components/UniversalTable"
import {getFirestore,onSnapshot,collection,query,startAt,limit,startAfter,orderBy} from "firebase/firestore"
import { useCallback, useState } from "react"
import { useEffect } from "react"
import moment from "moment"
import {map_status_to_priority} from "../../lib/utils"

const AllOrders = ()=>{
    const page_lim = 2
    const db = getFirestore()
    const [table_data,setTable_Data] = useState([[]])
    const [table_data_ref,setTable_Data_Ref] = useState([])
    const [last_nav,setLast_nav] = useState('next')

    /*
        I1
        I2
        -
        i3
        i4
        -
        i5
        I6
    */

    const [Query,setQuery] = useState(query(collection(db,'orders'),orderBy("time",'desc'),limit(page_lim)))
    //TODO add usecallback
    const prev =()=>{
        if(!table_data_ref.length)
        return
        
        var index = table_data_ref.length - 1
        if(last_nav !== 'prev')
            index = 0
        setLast_nav('prev')   

        const last = table_data_ref[index]
        setQuery(query(collection(db,'orders'),orderBy("time",'asc'),startAfter(last),limit(page_lim)))
    }
    const next =()=>{
        if(!table_data_ref.length)
            return

        var index = table_data_ref.length - 1
        if(last_nav !== 'next')
            index = 0
        setLast_nav('next')
        const first = table_data_ref[index] 

        setQuery(query(collection(db,'orders'),orderBy("time",'desc'),startAfter(first),limit(page_lim)))
    }
    useEffect(()=>{
        const unsub = onSnapshot(Query,(col)=>{ 
            
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

            if(new_table_data.length > 0)
                setTable_Data(new_table_data)
            if(col.docs.length > 0)
                setTable_Data_Ref(col.docs)

        })
        return unsub
    },[db,Query])
    const rows = ['Order ID','Table ID','Count','Time','Status']
    return <div className="orders">
        <UniversalTable head={rows} body={table_data} colors={table_data[0].length > 0 && table_data.map((it)=>it[4].toLowerCase())} title="All Orders" prev={prev} next={next} />
    </div>
}
export default AllOrders