import { useCallback, useState } from "react"
import { useEffect } from "react"
import moment from "moment"
import {map_status_to_priority} from "../../lib/utils"
import UniversalTable  from "."
import * as ROUTES from "../../ROUTES"
import * as APIROUTES from "../../APIROUTES"

import { useNavigate } from "react-router-dom"
import { FadeIn } from "../../animations"
import { motion } from "framer-motion"
import * as Query from "@tanstack/react-query"
import axios from "axios"

const PaginatedUniversalTable = ({queryConstraints = [],cs_query,group=false,title,colors,onDataSubmit,schema,structure,rows,onDataQueried,oncl,subscribe = false,page_lim= 10})=>{
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

    const {isLoading,error: result_error,refetch} = Query.useQuery([title,searchdata],async ()=>(await axios.get(cs_query,{
        params : {
            ...searchdata
        }
    })).data,{
        retry : false,
        enabled: true,
        refetchOnWindowFocus:false,
        onSuccess : (result)=>{
            console.log("FOUND NOW IN SUCCESS",result)
            console.log("FOUND NOW Treated",onDataQueried(result.data))
            ProcessDocuments(result.data)
        },
        onError : (err)=>{
            console.log("FOUND NOW IN ERR",err)
        },
        onSettled: (data,err)=>console.warn(data,err)
    })

    console.log(last_nav)

    const customOptions = {
        submit :  (data)=>{
            setSearchData({...searchdata,...data})
            setLast_nav('next')
            onDataSubmit(data)
        },
        structure : structure
    }

    const prev = useCallback(()=>{
        if(!table_data_ref.length)
        return
        
        var index = table_data_ref.length - 1
        if( last_nav !== "prev"  )
            index = 0
        setLast_nav('prev')   
        
        const last = table_data_ref[index]
        setSearchData({...searchdata,lastRef: last.id,dir: 'asc',swapped:  last_nav !== "prev" })
    },[table_data_ref,searchdata,last_nav])

    const next = useCallback(()=> {
        if(!table_data_ref.length)
            return
        console.log(table_data_ref)
        var index = table_data_ref.length - 1
        if( last_nav !== "next"  )
            index = 0

        setLast_nav('next')
        const first = table_data_ref[index]
        setSearchData({...searchdata,lastRef: first.id,dir: 'desc',swapped: last_nav !== "next"    })
    },[table_data_ref,searchdata,last_nav])

    const ProcessDocuments = useCallback( (col)=>{
        const new_table_data =  onDataQueried(col)
        setErrorMsg(null)
        if(new_table_data.length > 0)
            setTable_Data(new_table_data)
        if(col.length > 0)
            setTable_Data_Ref(col)
        else
            setErrorMsg({err: null,msg: "No Documents Found for the given query"})
    },[])

    useEffect(()=>{
        refetch()
    },[searchdata])

    return <motion.div variants={FadeIn()}className="orders-table">
        <UniversalTable head={rows} body={table_data} 
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