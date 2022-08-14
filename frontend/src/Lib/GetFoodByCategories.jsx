/*import { useCallback, useState } from "react"
import { useEffect } from "react"
import {collection, getDoc, getDocs, getFirestore, query, where} from "firebase/firestore"
const GetByCategories = (categories)=>{
    const [results,setResults] = useState(null)
    const [error,setError] = useState(null)
    const db = getFirestore()
    const getData = useCallback(async ()=>{
        try{
            let results_snapshot = null

            if(!categories || categories.length === 0)
                results_snapshot = await getDocs(collection(db,'food'))
            else
                results_snapshot = await  getDocs(query(collection(db,'food'),where('category','in',categories)))
            setResults(results_snapshot.docs.map((doc)=>{return {id: doc.id,...doc.data()}}))
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
export default GetByCategories*/