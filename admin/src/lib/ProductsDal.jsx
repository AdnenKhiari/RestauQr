import { useCallback, useEffect, useState } from "react"
import {getFirestore,doc, updateDoc, addDoc, collection, getDoc, setDoc, getDocs, query, where, deleteDoc, increment, runTransaction, getDocsFromServer, arrayRemove} from "firebase/firestore"
import { getInsTime } from "./utils"
import * as  Query  from "@tanstack/react-query"

import axios from "axios"
import * as APIROUTES from "../APIROUTES"
import { QueryClient } from "@tanstack/react-query"
const axios_inst = axios.create({
    withCredentials: true
})
export const GetProductById = (id)=>{

    const [error,setError] = useState(null)
    const qr = Query.useQuery(['products',id],async ()=>{
        const res = await axios_inst.get(APIROUTES.PRODUCTS.GET_PRODUCT_BY_ID(id))
        return res.data
    },{
        retry: 0,
        refetchOnWindowFocus: false
    })
    const {data,isLoading,error: quer_err,refetch}  = qr
    const fetch = async ()=>{
        try{
            await refetch()
        }catch(err){
            setError(err)
        }
    }
    useEffect(()=>{
        setError(quer_err)
    },[quer_err])
    console.log("Found",qr)
    return {
        result : data && data.data,
        error: quer_err,
        loading: isLoading,
        fetch
    }
}

export const GetMerchandiseById = (productid,orderid)=>{


    const [error,setError] = useState(null)
    const {data,isLoading,error: quer_err,refetch} = Query.useQuery(['products','product_instances',productid,orderid],async ()=>{
        const res = await axios_inst.get(APIROUTES.PRODUCTS.MERCHANDISE.GET_MERCHANDISE_OF_PRODUCT_BY_ID(productid,orderid))
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
        loading: isLoading,
        fetch: fetch
    }
}
export const preprocess_order = (data)=>{
    if(data.unitQuantity?.value)
        data.unitQuantity = data.unitQuantity.value * (data.unitQuantity.unit?.subunit ? data.unitQuantity.unit?.subunit.ratio : 1 )
    return data
} 
export const ConsumeMerchandiseItem = (productid,orderid) => {
    const [error,setError] = useState(null)
    const {data:result,isLoading,error: query_err,mutateAsync: send} = Query.useMutation(async (data)=>{
        const res =  await axios_inst.post(APIROUTES.PRODUCTS.MERCHANDISE.CONSUME_MERCHANDISE(productid,orderid),data)
      return res.data
    },{
        retry: 0
    })

    const mutate = async (data,global)=>{
        try{
            await send({...data,updateGlobally: global})
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
        result,
        error,
        loading: isLoading,
        mutate
    }
}

export const ConsumeProductItem = (productid) => {
    const [error,setError] = useState(null)
    const {data:result,isLoading,error: query_err,mutateAsync: send} = Query.useMutation(async (data)=>{
        const res =  await axios_inst.post(APIROUTES.PRODUCTS.CONSUME_PRODUCT(productid),data)
      return res.data
    },{
        retry: 0
    })

    const mutate = async (data)=>{
        try{
            await send(data)
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
        result,
        error,
        loading: isLoading,
        mutate
    }
}

export const RemoveProduct = (productid)=>{
    const ql = Query.useQueryClient()
    const {data,isLoading,error,refetch} = Query.useQuery([],async ()=>{
        const res = await axios_inst.delete(APIROUTES.PRODUCTS.REMOVE_PRODUCT(productid))
        return res.data
    },{
        enabled: false,
        retry: false
    })
    const mutate = async ()=>{
        const res = await refetch()
        if(res.error)
            throw  res.error
        ql.invalidateQueries([productid])
    }   
    return {
        loading: isLoading,
        error,
        remove: mutate
    }
}

export const RemoveMerchandise = (productid,orderid)=>{
    const {data,isLoading,error,refetch} = Query.useQuery(['product','product_instances',{productid,orderid}],async ()=>{
        const res = await axios_inst.delete(APIROUTES.PRODUCTS.MERCHANDISE.REMOVE_MERCHANDISE(productid,orderid))
        return res.data
    },{
        enabled: false,
        retry: false
    })
    const mutate = async ()=>{
        try{
            await refetch()
        }catch(err){
            throw err
        }
    }   
    return {
        loading: isLoading,
        error,
        remove: mutate
    }
}
export const AddUpdateMerchandise = (productid,add)=>{

    const [error,setError] = useState(null)
    const client = Query.useQueryClient()
    const {data:result,isLoading,error: query_err,mutateAsync: send} = Query.useMutation(async (all)=>{
       //console.warn(all)
        const res = add ?  await axios_inst.post(APIROUTES.PRODUCTS.MERCHANDISE.ADD_MERCHANDISE(productid),all.data) : await axios_inst.put(APIROUTES.PRODUCTS.MERCHANDISE.UPDATE_MERCHANDISE(productid,all.id),all.data)
      return res.data
    },{
        retry: 0
    })

    const mutate = async (data)=>{
        try{
            const id = data.id
            if(data.id)
                delete data.id
           // console.log("im ",add ? "adding" : "updaing"," dis",data,id)

            const res = await send({id: id,data})
            client.invalidateQueries([id])
            console.warn(res)
            return res.data
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
        result : result && result.data,
        error,
        loading: isLoading,
        mutate
    }
}


export const AddUpdateProduct = (add = false)=>{

    const [error,setError] = useState(null)
    const client = Query.useQueryClient()

    const {data:result,isLoading,error: query_err,mutateAsync: send} = Query.useMutation(async (all)=>{
       //console.warn(all)
        const res = add ?  await axios_inst.post(APIROUTES.PRODUCTS.ADD_PRODUCT,all.data) : await axios_inst.put(APIROUTES.PRODUCTS.UPDATE_PRODUCT(all.id),all.data)
      return res.data
    },{
        retry: 0
    })

    const mutate = async (data)=>{
        try{
            const id = data.id
            if(data.id)
                delete data.id
           // console.log("im ",add ? "adding" : "updaing"," dis",data,id)

            const res = await send({id: id,data})
            console.warn("Found res",res)
            client.invalidateQueries([id])

            return res.data.id
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
        result,
        error,
        loading: isLoading,
        mutate
    }
}