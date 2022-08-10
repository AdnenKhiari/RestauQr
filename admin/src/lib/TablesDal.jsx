import { addDoc, collection, deleteDoc, doc, getDoc, getFirestore, setDoc, updateDoc } from "firebase/firestore"
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
        console.log(data)
        try{
            const id = data.id
            delete data.id
            const snap = await setDoc(doc(db,'tables/'+id),data)
            console.log(snap)
            setResult(id    )
            return id  
            
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