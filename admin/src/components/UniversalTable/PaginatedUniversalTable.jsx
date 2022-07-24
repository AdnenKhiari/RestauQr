import { useCallback, useState } from "react"
import { useEffect } from "react"
import moment from "moment"
import {map_status_to_priority} from "../../lib/utils"
import UniversalTable  from "."
import * as ROUTES from "../../ROUTES"
import { useNavigate } from "react-router-dom"
import { FadeIn } from "../../animations"
import { motion } from "framer-motion"
import {getFirestore,onSnapshot,collection,query,where,limit,startAfter,orderBy,documentId, FieldPath, getDoc, getDocs, collectionGroup} from "firebase/firestore"



const PaginatedUniversalTable = ({queryConstraints = [],group=false,title,hide = null,colors,onDataSubmit,schema,structure,rows,filterData,onDataQueried,colname,pagname,oncl,subscribe = false,page_lim= 10})=>{
    const db = getFirestore()
    //for the table of orders
    const [table_data,setTable_Data] = useState([])
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
    const getBaseQuery = useCallback((customq = [orderBy(pagname,'desc')])=>{
        let cst = []
        if(searchdata){
            const res = filterData(searchdata,cst)
            if(res)
                return [(group ? collectionGroup(db,colname): collection(db,colname)),...res]
        }
        return ([(group ? collectionGroup(db,colname): collection(db,colname)),...queryConstraints,...cst,...customq,limit(page_lim)])

    },[queryConstraints,db,searchdata])
    //TODO add usecallback

    //for the query of orders
    const [Query,setQuery] = useState(getBaseQuery())

    const customOptions = useCallback({
        submit :  (data)=>{
            setSearchData({...data})
            setLast_nav('next')
            setQuery(getBaseQuery())
            onDataSubmit(data)
        },
        structure : structure
    },[getBaseQuery])

    const prev =useCallback(()=>{
        if(!table_data_ref.length)
        return
        
        var index = table_data_ref.length - 1
        if(last_nav !== 'prev')
            index = 0
        setLast_nav('prev')   

        const last = table_data_ref[index]
        setQuery(getBaseQuery([orderBy(pagname,'asc'),startAfter(last)]))
    },[getBaseQuery])

    const next = useCallback(()=> {
        if(!table_data_ref.length)
            return
        console.log(table_data_ref)
        var index = table_data_ref.length - 1
        if(last_nav !== 'next')
            index = 0
        setLast_nav('next')
        const first = table_data_ref[index]
        setQuery(getBaseQuery([orderBy(pagname,'desc'),startAfter(first)]))
    },[getBaseQuery])

    const ProcessDocuments = useCallback(async (col)=>{
        const new_table_data = await onDataQueried(col)
        setErrorMsg(null)
        if(new_table_data.length > 0)
            setTable_Data(new_table_data)
        if(col.docs.length > 0)
            setTable_Data_Ref(col.docs)
        else
            setErrorMsg({err: null,msg: "No Documents Found for the given query"})
    },[])

    useEffect(()=>{
        if(subscribe){
            const unsub = onSnapshot(query(...Query),async (col)=>{ 
                try{
                    await ProcessDocuments(col)
                }catch(err){
                    setErrorMsg({err:err,msg: "An Error Occured , Could Not Retrieve The Information Requested"})
                }
            })
            return unsub
        }else{
            const fts = async ()=>{
                try{
                    const col = await getDocs(query(...Query))
                    ProcessDocuments(col)
                }catch(err){
                    setErrorMsg({err:err,msg: "An Error Occured , Could Not Retrieve The Information Requested"})
                }
            }
            fts()
        }

    },[db,Query])

    return <motion.div variants={FadeIn()}className="orders-table">
        <UniversalTable head={rows} body={table_data} 
        hide = {hide}
        colors={colors} 
        title={title} 
        oncl={oncl} 
        prev={prev} 
        next={next}  
        schema={schema}
        errs={errormsg}
        customOptions={customOptions}/>
    </motion.div>
}

export default PaginatedUniversalTable