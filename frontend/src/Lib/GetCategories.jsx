import { useCallback, useState } from "react"
import { useEffect } from "react"
import {collection, doc, getDoc, getDocs, getFirestore, query, where} from "firebase/firestore"
import axios from 'axios'
import  APIROUTES from "../Routes/API"

import {useQuery} from "react-query"
export const GetCategories = ()=>{

    const {data: result,isLoading,error} = useQuery(["categories"],async ()=>{
        const res = await axios.get(APIROUTES.GET_CATEGORIES)
        return res.data
    },{
        refetchOnWindowFocus: false
    })
    return {
        data: result && result.data.categories,
        error,
        loading: isLoading
    }
}
export default GetCategories