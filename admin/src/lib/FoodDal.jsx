import { useEffect, useState } from "react"
import {getFirestore,doc, updateDoc, addDoc, collection, getDoc, setDoc} from "firebase/firestore"
export const AddUpdateFood = ()=>{

    const [result,setResult] = useState(null)
    const [error,setError] = useState(null)
    const [loading,setLoading] = useState(null)
    const db = getFirestore()
    const mutate = async (data)=>{
        setLoading(true)
        try{
            var ref = null
            if(data.id){
                ref = doc(db,'food',(data.id))
                delete data.id
                await setDoc(ref,data)
                setResult(data.id)
                return data.id
            }else{
                const snap = await addDoc(collection(db,'food'),data)
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

export const GetFoodById = (id)=>{

    const [result,setResult] = useState(null)
    const [error,setError] = useState(null)
    const db = getFirestore()

    const fetch = async ()=>{
        try{
            const food = await getDoc(doc(db,'food',id))
            if(food.exists()){
                const food_data = food.data()
                const id = food.id
                setResult({id,...food_data})
            }else{
                throw new Error('Invalid Id')
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
