import { useCallback, useState } from "react"
import { useEffect } from "react"
import {collection, getDoc, doc, getFirestore, query, where} from "firebase/firestore"
const GetFoodById = (id)=>{
    const [results,setResults] = useState(null)
    const [error,setError] = useState(null)
    const db = getFirestore()
    const getData = useCallback(async ()=>{
        try{
            let dc = await getDoc(doc(collection(db,'food'),id))
            setResults({id: dc.id,...dc.data()})
            console.log("cat",id,dc)
        }catch(err){
            console.log("ERR",err)
            setError(err)
        }
    },[id,db])

    useEffect(()=>{
        setResults(null)
        setError(null)
        getData()
    },[getData])

    console.log("RES",results,id)
    return {
        data: results,
        error: error,
        loading: error === null &&  results === null
    }
}
export default GetFoodById