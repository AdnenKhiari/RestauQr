import { doc, getDoc, getFirestore, onSnapshot } from "firebase/firestore"
import { useEffect } from "react"
import { useState } from "react"
import { getTodayDate } from "./utils"

export const GetGlobalStats = ()=>{
    const [result,setResult] = useState(null)
    const [error,setError] = useState(null)
    const db = getFirestore()
    useEffect(()=>{
        const ref = doc(db,'global_stats',getTodayDate())
        const unsub = onSnapshot(ref,(menu)=>{
            if(menu.exists()){
                const menu_data = menu.data()
                setResult({id: menu.id,...menu_data})
            }else{
                setResult({id: menu.id,success: 0,canceled: 0,total:0,orders:0})
            }
        },(err)=>{
            setError(err)
        })
        return unsub
    },[db,getTodayDate()])

    return {
        data: result,
        error,
        loading: !result && !error
    }
}