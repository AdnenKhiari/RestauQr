import { addDoc, collection, deleteDoc, doc, getDoc, getFirestore, setDoc } from "firebase/firestore"
import { useEffect, useState } from "react"

export const GetTableById = (id)=>{

    const [result,setResult] = useState(null)
    const [error,setError] = useState(null)
    const db = getFirestore()

    const fetch = async ()=>{
        try{
            const table = await getDoc(doc(db,'tables',id))
            if(table.exists()){
                const food_data = table.data()
                const id = table.id
                setResult({id,...food_data})
            }else{
                throw new Error('Invalid Table Id')
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
export const AddUpdateTable = ()=>{

    const [result,setResult] = useState(null)
    const [error,setError] = useState(null)
    const [loading,setLoading] = useState(null)
    const db = getFirestore()
    const mutate = async (data)=>{
        setLoading(true)
        try{
            var ref = null
            if(data.id){
                ref = doc(db,'tables',(data.id))
                const foodid = data.id+""
                delete data.id
                await setDoc(ref,data)
                setResult(foodid)
                return foodid
            }else{
                const snap = await addDoc(collection(db,'tables'),data)
                setResult(snap.id)
                return snap.id  
            }
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

export const DeleteTableById =  ()=>{

    const [result,setResult] = useState(null)
    const [error,setError] = useState(null)
    const db = getFirestore()

    const del = async (id)=>{
        try{
            await deleteDoc(doc(db,'tables',id))
            setResult(id)
            return id
        }catch(err){
            setError(err)
        }
    }

    return {
        deleteTable : del,
        result,
        error,
        loading: !result && !error
    }
}