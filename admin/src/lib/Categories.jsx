import { addDoc, collection, doc, getDoc, getDocs, getFirestore, setDoc, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import * as APIROUTES from "../APIROUTES"
import axios from "axios"
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"

const axios_inst = axios.create({
    withCredentials: true
})

export const UpdateCategories = ()=>{

    const cl = useQueryClient()
    const {data: result,isLoading,error,mutateAsync} = useMutation(async (cats)=>{
        const res = await axios_inst.put(APIROUTES.CATEGORIES.UPDATE_CATEGORIES,{categories: cats})
        return res.data
    },{
        refetchOnWindowFocus: false,
        onSuccess: (dt)=>cl.invalidateQueries("categories")
    })

    return {
        error,
        loading: isLoading,
        mutate: mutateAsync
    }
}

export const GetCategories = ()=>{

    const {data: result,isLoading,error} = useQuery(["categories"],async ()=>{
        const res = await axios_inst.get(APIROUTES.CATEGORIES.GET_CATEGORIES)
        return res.data
    },{
        refetchOnWindowFocus: false
    })
    console.warn("DT",result)
    return {
        result: result && result.data.categories,
        error,
        loading: isLoading
    }
}

export const UpdateTable = ()=>{
    const [error,setError] = useState(null)
    const [laoding,setLoading] = useState(null)

    const db = getFirestore()

    const mutate = async (data)=>{
        setError(null)
        try{
            setLoading(true)
            await updateDoc(doc(db,'utils/menu'),{
                tables: {...data}
            })
        }catch(err){
            setError(err)
            throw err
        }finally{
            setLoading(false)
        }

    }
    return {
        error,
        laoding,
        mutate
    }
}

export const GetTables = ()=>{
    
    const [result,setResult] = useState(null)
    const [error,setError] = useState(null)
    const db = getFirestore()

    const fetch = async ()=>{
        try{
            const menu = await getDocs(collection(db,'tables'))
            if(menu.docs.length > 0){
                const tables = menu.docs.map((table)=>{return {...table.data(),id: table.id}})
                setResult(tables)
            }else{
                throw new Error('tables Information not found')
            }
        }catch(err){
            setError(err)
        }
    }
    useEffect(()=>{
        fetch()
    },[db])

    return {
        result,
        error,
        loading: !result && !error
    }
}