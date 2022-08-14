import { useCallback, useState } from "react"
import { useEffect } from "react"
import {useQuery} from "react-query"
import axios from "axios"

import APIROUTES from "../Routes/API"

const GetAllFood = ()=>{
    const {data,isLoading,query_error} = useQuery(["food"], async ()=>{
        const result = await axios.get(APIROUTES.GET_FOOD)
        return result.data
    },{
        refetchOnWindowFocus: false,
        retry: 2
    })

    console.log("RES ALL FOOD",data,isLoading,query_error)
    return {
        data: (data && data.data) || [],
        error: query_error,
        loading: isLoading
    }
}
export default GetAllFood