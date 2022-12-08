import { useState } from "react"
import { useEffect } from "react"
import * as  Query  from "@tanstack/react-query"

import axios from "axios"
import * as APIROUTES from "../APIROUTES"

const axios_inst = axios.create({
    withCredentials: true
})
//Temporarly using the firebase admin sdk

export const GetOrderById = (id)=>{

    const [error,setError] = useState(null)
    const {data,isLoading,error: quer_err,refetch} = Query.useQuery(['orders',id],async ()=>{
        const res = await axios_inst.get(APIROUTES.ORDERS.GET_ORDER_BY_ID(id))
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

export const GetSubOrderById = (orderid,subid)=>{


    const [error,setError] = useState(null)
    const {data,isLoading,error: quer_err,refetch} = Query.useQuery(['sub_orders','orders',orderid,subid],async ()=>{
        const res = await axios_inst.get(APIROUTES.ORDERS.SUB_ORDERS.GET_SUB_ORDER_BY_ID(orderid,subid))
        return res.data
    },{
        retry: 0,
        refetchOnWindowFocus: false
    })
    const process = (data)=>{
        return data
    }
    const fetch = async ()=>{
        try{
            await refetch()
        }catch(err){
            setError(err)
        }
    }
    console.log("Dt",data,isLoading,error)
    useEffect(()=>{
        setError(quer_err)
    },[quer_err])
    
    return {
        result : data && process(data.data),
        error,
        loading: isLoading
    }
}

export const UpdateOrder = (id)=>{


    const [error,setError] = useState(null)
    const {data,isLoading,error: query_err,mutateAsync} = Query.useMutation(async (data)=>{
        //console.warn(all)
        const res =  await axios_inst.put(APIROUTES.ORDERS.UPDATE_ORDER(id),data)
       return res.data
     },{
         retry: 0
     })

    const fetch = async (st)=>{

        try{
            await mutateAsync({status: st})
        }catch(err){
            setError(err)
        }
    }
    console.log("Dt",data,isLoading,error)
    useEffect(()=>{
        setError(query_err)
    },[query_err])
    
    return {
        mutate: fetch,
        data: data && data.data,
        loading: isLoading,
        error
    }
}



export const UpdateSubOrder = (orderid,subid)=>{

    const [error,setError] = useState(null)
    const {data,isLoading,error: query_err,mutateAsync} = Query.useMutation(async (data)=>{
        //console.warn(all)
        const res =  await axios_inst.put(APIROUTES.ORDERS.SUB_ORDERS.UPDATE_SUB_ORDER(orderid,subid),data)
       return res.data
     },{
         retry: 0
     })

    const fetch = async (st,reason)=>{

        try{
            await mutateAsync({status: st,reason: reason})
        }catch(err){
            setError(err)
        }
    }

    useEffect(()=>{
        setError(query_err)
    },[query_err])
    
    return {
        mutate: fetch,
        data: data && data.data,
        loading: isLoading,
        error
    }
}