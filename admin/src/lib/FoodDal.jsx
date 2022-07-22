import { useCallback, useEffect, useState } from "react"
import {getFirestore,doc, updateDoc, addDoc, collection, getDoc, setDoc, getDocs, query, where, deleteDoc} from "firebase/firestore"
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
                const foodid = data.id+""
                delete data.id
                await updateDoc(ref,data)
                setResult(foodid)
                return foodid
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

export const DeleteFoodById =  ()=>{

    const [result,setResult] = useState(null)
    const [error,setError] = useState(null)
    const db = getFirestore()

    const del = async (id)=>{
        try{
            await deleteDoc(doc(db,'food',id))
            setResult(id)
            return id
        }catch(err){
            setError(err)
        }
    }

    return {
        deleteFood : del,
        result,
        error,
        loading: !result && !error
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

export const GetByCategories = (categories)=>{
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
    },[categories])

    console.log("RES",results,categories)
    return {
        data: results,
        error: error,
        loading: error === null &&  results === null
    }
}