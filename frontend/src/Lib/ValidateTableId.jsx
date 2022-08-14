import { useCallback, useState } from "react"
import { useEffect } from "react"
import {collection, getDoc, doc, getFirestore, query, where} from "firebase/firestore"

import APIROUTES from "../Routes/API"
import {useQuery} from "react-query"
import axios from "axios"

const ValidateTableId = (id)=>{
    const [results,setResults] = useState(null)
    const [error,setError] = useState(null)
    const {data : result,isLoading,error: query_error} = useQuery(["current-table"], async ()=>{
        const res = await axios.get(APIROUTES.GET_TABLE_BY_ID(id))
        return res.data
    },{
        refetchOnWindowFocus: false,
        retry: 0
    })
    useEffect(()=>{
        console.warn("XDDDDD",results)
        if(result){
            if(result && !result.data.disabled)
                setResults(result.data)
            else 
                setError(new Error("Table Not In Service"))
        }
    },[result])
    useEffect(()=>{
        console.warn("EZEZE",results)
        setError(query_error)
    },[query_error])
    console.log("RES ALL FOOD",results,isLoading,query_error)
    return {
        data: results,
        error: error,
        loading: isLoading
    }
}
export default ValidateTableId