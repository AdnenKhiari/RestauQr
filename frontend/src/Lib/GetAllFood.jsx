import { useCallback, useState } from "react"
import { useEffect } from "react"
import {collection, getDoc, getDocs, getFirestore, query, where} from "firebase/firestore"

const GetAllFood = ()=>{
    const [results,setResults] = useState(null)
    const [error,setError] = useState(null)
    const db = getFirestore()
    const getData = useCallback(async ()=>{
        try{
            let results_snapshot =  await getDocs(collection(db,'food'))
            if(results_snapshot.docs.length > 0)
                setResults(results_snapshot.docs.map((doc)=>{return {id: doc.id,...doc.data()}}))
            else
                throw Error("Empty Menu")
            console.log("All Food",results_snapshot)
        }catch(err){
            console.log("ERR",err)
            setError(err)
        }
    },[db])

    useEffect(()=>{
        setResults(null)
        setError(null)
        getData()
    },[getData])

    console.log("RES",results)
    return {
        data: results,
        error: error,
        loading: error === null &&  results === null
    }
}
export default GetAllFood