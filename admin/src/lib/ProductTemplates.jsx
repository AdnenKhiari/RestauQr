import { useCallback, useEffect, useState } from "react"
import * as  Query  from "@tanstack/react-query"
import axios from "axios"
import * as APIROUTES from "../APIROUTES"
import { QueryClient } from "@tanstack/react-query"
const axios_inst = axios.create({
    withCredentials: true
})

export const RemoveProductTemplate = (productid)=>{
    const ql = Query.useQueryClient()
    const {data,isLoading,error,refetch} = Query.useQuery(['remove-product',productid],async ()=>{
        const res = await axios_inst.delete(APIROUTES.PRODUCTS.TEMPLATES.REMOVE_TEMPLATE(productid))
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
        ql.invalidateQueries([productid])
    }   
    return {
        loading: isLoading ,
        error,
        remove: mutate
    }
}

export const AddUpdateProductTemplate = (productid,add = false)=>{

    const [error,setError] = useState(null)
    const client = Query.useQueryClient()

    const {data:result,isLoading,error: query_err,mutateAsync: send} = Query.useMutation(async (all)=>{
      const res = add ?  await axios_inst.post(APIROUTES.PRODUCTS.TEMPLATES.ADD_TEMPLATE(productid),all.data) : await axios_inst.put(APIROUTES.PRODUCTS.TEMPLATES.UPDATE_TEMPLATE(productid,all.id),all.data)
      return res.data
    },{
        retry: 0
    })

    const mutate = async (data)=>{
        try{
           // console.log("im ",add ? "adding" : "updaing"," dis",data,id)

            const res = await send({id: undefined,data})
            console.warn("Found res",res)
            client.invalidateQueries([productid])
            return productid
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