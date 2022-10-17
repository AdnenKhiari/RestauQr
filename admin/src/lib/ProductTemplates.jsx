import { useCallback, useEffect, useState } from "react"
import * as  Query  from "@tanstack/react-query"
import axios from "axios"
import * as APIROUTES from "../APIROUTES"
import { QueryClient } from "@tanstack/react-query"
const axios_inst = axios.create({
    withCredentials: true
})

export const GetProductTemplateById = (id,templateid)=>{

    const [error,setError] = useState(null)
    const qr = Query.useQuery(['product_template',{id,templateid}],async ()=>{
        const res = await axios_inst.get(APIROUTES.PRODUCTS.TEMPLATES.GET_PRODUCT_TEMPLATE_BY_ID(id))
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


export const RemoveProductTemplate = (productid,templateid)=>{
    const ql = Query.useQueryClient()
    const {data,isLoading,error,refetch} = Query.useQuery([],async ()=>{
        const res = await axios_inst.delete(APIROUTES.PRODUCTS.TEMPLATES.REMOVE_TEMPLATE(productid,templateid))
        return res.data
    },{
        enabled: false,
        retry: false
    })
    const mutate = async ()=>{
        const res = await refetch()
        if(res.error)
            throw  res.error
        ql.invalidateQueries(["product_template",{id:productid,templateid: templateid}])
    }   
    return {
        loading: isLoading,
        error,
        remove: mutate
    }
}

export const AddUpdateProductTemplate = (productid,add = false)=>{

    const [error,setError] = useState(null)
    const client = Query.useQueryClient()

    const {data:result,isLoading,error: query_err,mutateAsync: send} = Query.useMutation(async (all)=>{
       //console.warn(all)
        const res = add ?  await axios_inst.post(APIROUTES.PRODUCTS.TEMPLATES.ADD_TEMPLATE(productid),all.data) : await axios_inst.put(APIROUTES.PRODUCTS.TEMPLATES.UPDATE_TEMPLATE(productid,all.id),all.data)
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
            client.invalidateQueries([{id:productid,templateid: data.id},'product_template'])
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