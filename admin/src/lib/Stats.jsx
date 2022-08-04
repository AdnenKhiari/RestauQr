import { doc, getDoc, getFirestore } from "firebase/firestore"
import { useEffect } from "react"
import { useState } from "react"
import { getTodayDate } from "./utils"

export const GetGlobalStats = ()=>{
    const [result,setResult] = useState(null)
    const [error,setError] = useState(null)
    const db = getFirestore()

    const fetch = async ()=>{
        try{
            const menu = await getDoc(doc(db,'global_stats',getTodayDate()))
            if(menu.exists()){
                const menu_data = menu.data()
                setResult({id: menu.id,...menu_data})
            }else{
                throw new Error('Stats not found for ' + getTodayDate())
            }
        }catch(err){
            setError(err)
        }
    }
    useEffect(()=>{
        fetch()
    },[db])

    return {
        data: result,
        error,
        loading: !result && !error
    }
}