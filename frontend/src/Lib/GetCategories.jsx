import { useCallback, useState } from "react"
import { useEffect } from "react"
import {collection, doc, getDoc, getDocs, getFirestore, query, where} from "firebase/firestore"
const GetCategories = (categories)=>{
    const [results,setResults] = useState(null)
    const [error,setError] = useState(null)
    const db = getFirestore()
    const getData = useCallback(async ()=>{
        try{
            let results_snapshot = await  getDoc(doc(db,'utils/menu'))
            if(!results_snapshot.exists())
                throw Error("No Categories Found")
            setResults(results_snapshot.data().categories)
            console.log("cat",categories,results_snapshot)
        }catch(err){
            console.log("ERR",err)
            setError(err)
        }
    },[categories,db])

    useEffect(()=>{
        setResults(null)
        setError(null)
        getData()
    },[getData])

    console.log("RES",results,categories)
    return {
        data: results,
        error: error,
        loading: error === null &&  results === null
    }
}
export default GetCategories