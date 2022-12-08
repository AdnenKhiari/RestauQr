import { addDoc, collection, deleteDoc, doc, getDoc, getFirestore, setDoc, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import * as  Query  from "@tanstack/react-query"
import axios from "axios"
import * as APIROUTES from "../APIROUTES"

const axios_inst = axios.create({
    withCredentials: true
})
export const GetTables = ()=>{
    
    const {data: result,isLoading,error} = Query.useQuery(["tables"],async ()=>{
        const res = await axios_inst.get(APIROUTES.TABLES.GET_TABLES)
        return res.data
    },{
        refetchOnWindowFocus: false
    })
    console.warn("DT",result)
    return {
        result: result && result.data,
        error,
        loading: isLoading
    }
}
export const GetTableById = (id)=>{

    const [error,setError] = useState(null)
    const {data,isLoading,error: quer_err,refetch} = Query.useQuery(['tables',id],async ()=>{
        const res = await axios_inst.get(APIROUTES.TABLES.GET_TABLE_BY_ID(id))
        return res.data
    },{
        retry: 0,
        refetchOnWindowFocus: false
    })
    const fetch = async ()=>{
        try{
            await refetch()
        }catch(err){
            setError(err)
        }
    }
    //console.log("Dt",data,isLoading,error)
    useEffect(()=>{
        setError(quer_err)
    },[quer_err])
    
    return {
        result : data && data.data,
        error,
        loading: isLoading,
        fetch
    }
}
export const AddUpdateTable = (add)=>{

    const [error,setError] = useState(null)
    const {data:result,isLoading,error: query_err,mutateAsync: send} = Query.useMutation(async (all)=>{
       //console.warn(all)
        const res = add ?  await axios_inst.post(APIROUTES.TABLES.ADD_TABLE,all.data) : await axios_inst.put(APIROUTES.TABLES.UPDATE_TABLE(all.id),all.data)
      return res.data
    },{
        retry: 0
    })

    const mutate = async (data)=>{
        try{
            const data_result =  await send({id: data.id,data})
            return data_result.data.id
        }catch(err){
            setError(err)
            throw err
        }
    }
    console.log(result,isLoading,error)

    useEffect(()=>{
        setError(query_err)
    },[query_err])

    return {
        result: result && result.data && result.id,
        error,
        loading: isLoading,
        mutate
    }
}

export const DeleteTableById =  (id)=>{
    const [error,setError] = useState(null)
    const {data,isLoading,error: quer_err,refetch} = Query.useQuery(['delete-table',id],async ()=>{
        const res = await axios_inst.delete(APIROUTES.TABLES.REMOVE_TABLE(id))
        return res.data
    },{
        retry: 0,
        enabled: false,
        cacheTime: 0,
        refetchOnWindowFocus: false
    })
    const fetch = async ()=>{
        try{
            await refetch()
        }catch(err){
            setError(err)
        }
    }
    //console.log("Dt",data,isLoading,error)
    useEffect(()=>{
        setError(quer_err)
    },[quer_err])
    
    return {
        result : data && data.data,
        error,
        loading: isLoading,
        deleteTable: fetch
    }
}