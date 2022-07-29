import { useCallback, useState } from "react"
import { useEffect } from "react"
import {collection, getDoc, doc, getFirestore, query, where} from "firebase/firestore"
const ValidateTableId = (id)=>{
    const [results,setResults] = useState(null)
    const [error,setError] = useState(null)
    const db = getFirestore()
    const getData = useCallback(async ()=>{
        try{
            if(isNaN(id)){
                throw Error("Invalid Table Id")   
            }
            let dc = await getDoc(doc(collection(db,'tables'),''+id))
            if(!dc.exists())
                throw Error("No Table Info Found ")
            const data = dc.data()
            console.log("cat",id,data)

            if(!data.disabled)
                setResults(data.categories)
            else
                throw Error("Table Not In Service")
        }catch(err){
            console.log("ERR",err)
            setError(err)
        }
    },[id,db])

    useEffect(()=>{
        setResults(null)
        setError(null)
        getData()
    },[id,db,getData])

    console.log("RES",results,id)
    return {
        data: results,
        error: error,
        loading: error === null &&  results === null
    }
}
export default ValidateTableId