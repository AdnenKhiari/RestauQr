import { addDoc, collection, doc, getFirestore, setDoc, updateDoc } from "firebase/firestore"
import { useState } from "react"

const UpdateCategories = ()=>{

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
export  default UpdateCategories