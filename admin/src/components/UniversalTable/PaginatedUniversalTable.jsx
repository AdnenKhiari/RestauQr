import { useCallback, useState } from "react"
import { useEffect } from "react"
import moment from "moment"
import {map_status_to_priority} from "../../lib/utils"
import UniversalTable  from "."
import * as ROUTES from "../../ROUTES"
import { useNavigate } from "react-router-dom"
import { FadeIn } from "../../animations"
import { motion } from "framer-motion"
import * as Query from "@tanstack/react-query"


const PaginatedUniversalTable = ({queryConstraints = [],cs_query,group=false,title,colors,onDataSubmit,schema,structure,rows,filterData,onDataQueried,colname,pagname,oncl,subscribe = false,page_lim= 10})=>{
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

    const {isLoading,error: result_error,refetch} = Query.useQuery([title],cs_query,{
        retry : false,
        enabled: false
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

        setLast_nav('prev')   

        const last = table_data_ref[index]
        setSearchData({...searchdata,lastRef: last.id,dir: 'asc',swapped: last_nav !== 'prev' })
    },[])

    const next = useCallback(()=> {
        if(!table_data_ref.length)
            return
        console.log(table_data_ref)
        var index = table_data_ref.length - 1
        setLast_nav('next')
        const first = table_data_ref[index]
        setSearchData({...searchdata,lastRef: first.id,dir: 'desc',swapped: last_nav !== 'next' })
    },[])

    const ProcessDocuments = useCallback(async (col)=>{
        const new_table_data = await onDataQueried(col)
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