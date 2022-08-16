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