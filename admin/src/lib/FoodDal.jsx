import { useCallback, useEffect, useState } from "react"
import {getFirestore,doc, updateDoc, addDoc, collection, getDoc, setDoc, getDocs, query, where, deleteDoc} from "firebase/firestore"
import * as  Query  from "@tanstack/react-query"
import axios from "axios"
import * as APIROUTES from "../APIROUTES"

const axios_inst = axios.create({
    withCredentials: true
})
export const AddUpdateFood = (add = false)=>{

    const [error,setError] = useState(null)
    const client = Query.useQueryClient()
    const {data:result,isLoading,error: query_err,mutateAsync: send} = Query.useMutation(async (all)=>{
       //console.warn(all)
        const res = add ?  await axios_inst.post(APIROUTES.FOOD.ADD_FOOD,all.data) : await axios_inst.put(APIROUTES.FOOD.UPDATE_FOOD(all.id),all.data)
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

            const result  = await send({id: id,data})
            client.invalidateQueries(['food',id])
            return result.data && result.data.id
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
        result: result && result.data && result.data.id,
        error,
        loading: isLoading,
        mutate
    }
}

export const DeleteFoodById =  (foodid)=>{

    const [error,setError] = useState(null)
    const {data,isLoading,error: quer_err,refetch} = Query.useQuery(['delete-food',foodid],async ()=>{
        const res = await axios_inst.delete(APIROUTES.FOOD.REMOVE_FOOD(foodid))
        return res.data
    },{
        retry: 0,
        enabled: false,
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
        deleteFood: fetch
    }
}

export const GetFoodById = (id,forceUpdate = true)=>{

    const [error,setError] = useState(null)
    const client = Query.useQueryClient()
    const {data,isLoading,error: quer_err,refetch} = Query.useQuery(['food',`food:${id}`],async ()=>{
        const res = await axios_inst.get(APIROUTES.FOOD.GET_FOOD_BY_ID(id))
        return res.data
    },{
        retry: 0,
        refetchOnWindowFocus: false,
    })
    const fetch = async ()=>{
        try{
            await refetch()
        }catch(err){
            setError(err)
        }
    }
    useEffect(()=>{
        console.info("REMOVING NOWW")
        client.removeQueries([`food:${id}`,'food'])
    },[])
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

export const GetByCategories = (categories)=>{

    const [error,setError] = useState(null)
    console.warn(categories)
    const {data,isLoading,error: quer_err} = Query.useQuery(['food'],async ()=>{
        const res = await axios_inst.get(APIROUTES.FOOD.GET_FOODS,{
            params: {
                categories: categories
            }
        })
        return res.data
    },{
        retry: 0,
        refetchOnWindowFocus: false
    })
    console.log("Dt",data,isLoading,error)
    useEffect(()=>{
        setError(quer_err)
    },[quer_err])
    
    return {
        data : data && data.data,
        error,
        loading: isLoading
    }
}