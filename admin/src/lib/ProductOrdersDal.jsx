import { useCallback, useEffect, useState } from "react"
import * as  Query  from "@tanstack/react-query"

import axios from "axios"
import * as APIROUTES from "../APIROUTES"
const axios_inst = axios.create({
    withCredentials: true
})
export const AddUpdateProductOrders = (supplierid,add = false)=>{

    const [error,setError] = useState(null)
    const client = Query.useQueryClient()

    const {data:result,isLoading,error: query_err,mutateAsync: send} = Query.useMutation(async (all)=>{
       //console.warn(all)
        const res = add ?  await axios_inst.post(APIROUTES.PRODUCT_ORDERS.ADD_PRODUCT_ORDERS(supplierid),all.data) : await axios_inst.put(APIROUTES.PRODUCT_ORDERS.UPDATE_PRODUCT_ORDERS(supplierid,all.id),all.data)
      return res.data
    },{
        retry: 0
    })

    const mutate = async (data)=>{
        try{
            const id = data.id
            if(data.id)
                delete data.id
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

export const RemoveProductOrdersById = (supplierid,prodid)=>{
    const ql = Query.useQueryClient()
    const {data,isLoading,error,refetch} = Query.useQuery(['remove-product-order',supplierid,prodid],async ()=>{
        const res = await axios_inst.delete(APIROUTES.PRODUCT_ORDERS.REMOVE_PRODUCT_ORDERS(supplierid,prodid))
        return res.data
    },{
        enabled: false,
        cacheTime: 0,
        retry: false
    })
    const mutate = async ()=>{
        const res = await refetch()
        if(res.error)
            throw  res.error
        ql.invalidateQueries([supplierid,prodid])
    }   
    return {
        loading: isLoading,
        error,
        remove: mutate
    }
}

export const GetProductOrdersById = (supplierid,id)=>{

    const [error,setError] = useState(null)
    const qr = Query.useQuery(['product_orders',id],async ()=>{
        const res = await axios_inst.get(APIROUTES.PRODUCT_ORDERS.GET_PRODUCT_ORDERS_BY_ID(supplierid,id))
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