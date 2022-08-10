import { doc, query,collection, getFirestore, onSnapshot, where, orderBy, limit } from "firebase/firestore"
import { useEffect } from "react"
import { useState } from "react"
import { getDateFromN, getTodayDate } from "./utils"

export const GetGlobalStats = ()=>{
    const [result,setResult] = useState(null)
    const [error,setError] = useState(null)
    const db = getFirestore()
    useEffect(()=>{
        const ref = doc(db,'global_stats',getTodayDate())
        const unsub = onSnapshot(ref,(menu)=>{
            if(menu.exists()){
                const menu_data = menu.data()
                setResult({id: menu.id,
                    success:menu_data.success,
                    canceled: menu_data.success,
                    total:menu_data.success,
                    orders:menu_data.success})
            }else{
                setResult({id: menu.id,
                    success: 0,
                    canceled: 0,
                    total:0,
                    orders:0})
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

export const GetLast24hOrders = ()=>{
    const [result,setResult] = useState(null)
    const [error,setError] = useState(null)
    const db = getFirestore()
    useEffect(()=>{
        const ref = collection(db,'global_stats')
        const unsub = onSnapshot(query(ref,orderBy('date','desc'),limit(2)),(dt)=>{
     
            if(dt.docs.length > 0){
                const res = []
                dt.docs.forEach((ch)=>{
                    const kdata = ch.data()
                    if(kdata.events)
                        res.push(...kdata.events)
                })
                setResult(res)
            }else{
                setResult([])
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