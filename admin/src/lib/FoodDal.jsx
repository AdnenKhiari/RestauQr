import { useState } from "react"
import {getFirestore,doc, updateDoc, addDoc, collection} from "firebase/firestore"
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
                ref = doc(db,'food',parseInt(data.id))
                await updateDoc(ref,data)
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