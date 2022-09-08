import { useEffect, useState } from "react"
import * as APIROUTES from "../APIROUTES"
import axios from "axios"
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"

const axios_inst = axios.create({
    withCredentials: true
})

export const UpdateUnits = ()=>{
    const cl = useQueryClient()
    const {data: result,isLoading,error,mutateAsync} = useMutation(async (cats)=>{
        const res = await axios_inst.put(APIROUTES.UNITS.UPDATE_UNITS,cats)
        return res.data
    },{
        refetchOnWindowFocus: false,
        onSuccess: (dt)=>cl.invalidateQueries("units")
    })

    return {
        error,
        loading: isLoading,
        mutate: mutateAsync
    }
}

export const GetUnits = ()=>{

    const {data: result,isLoading,error} = useQuery(["units"],async ()=>{
        const res = await axios_inst.get(APIROUTES.UNITS.GET_UNITS)
        return res.data
    },{
        refetchOnWindowFocus: false,
        retry: 2
    })
    return {
        result: result && result.data.allunits,
        error,
        loading: isLoading
    }
}