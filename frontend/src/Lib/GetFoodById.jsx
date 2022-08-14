import { useCallback, useState } from "react"
import { useEffect } from "react"
import {collection, getDoc, doc, getFirestore, query, where} from "firebase/firestore"
import {useQuery} from "react-query"
import APIROUTES from "../Routes/API"
import axios from "axios"

const GetFoodById = (id)=>{
    const {data,isLoading,query_error} = useQuery(["food",id], async ()=>{
        const result = await axios.get(APIROUTES.GET_FOOD_BY_ID(id))
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
export default GetFoodById