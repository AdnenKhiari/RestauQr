import { addDoc, collection, doc, getDoc, getFirestore, setDoc, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"

export const UpdateCategories = ()=>{

    const [result,setResult] = useState(null)
    const [error,setError] = useState(null)
    const [loading,setLoading] = useState(null)
    const db = getFirestore()
    const mutate = async (categories)=>{
        setLoading(true)
        try{
            const doc_ref = doc(db,'utils','menu')
            
            await updateDoc(doc_ref,{categories})
            setResult(categories)
            return categories
        }catch(err){
            setError(err)
            throw err
        }finally{
            setLoading(false)
        }
    }

    return {
        result,
        error,
        loading,
        mutate
    }
}

export const GetCategories = ()=>{

    const [result,setResult] = useState(null)
    const [error,setError] = useState(null)
    const db = getFirestore()

    const fetch = async ()=>{
        try{
            const menu = await getDoc(doc(db,'utils','menu'))
            if(menu.exists()){
                const menu_data = menu.data()
                setResult(menu_data.categories)
            }else{
                throw new Error('Categories not found')
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
            const menu = await getDoc(doc(db,'utils','menu'))
            if(menu.exists()){
                const menu_data = menu.data()
                setResult(menu_data.tables)
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