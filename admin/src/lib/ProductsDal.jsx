import { useCallback, useEffect, useState } from "react"
import {getFirestore,doc, updateDoc, addDoc, collection, getDoc, setDoc, getDocs, query, where, deleteDoc} from "firebase/firestore"

export const GetProductById = (id)=>{

    const [result,setResult] = useState(null)
    const [error,setError] = useState(null)
    const db = getFirestore()

    const fetch = async ()=>{
        try{
            const product = await getDoc(doc(db,'products',id))
            if(product.exists()){
                const product_data = product.data()
                const id = product.id
                setResult({id,...product_data})
            }else{
                throw new Error('Invalid Product Id')
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

export const AddUpdateProductOrder = (productid)=>{

    const [result,setResult] = useState(null)
    const [error,setError] = useState(null)
    const [loading,setLoading] = useState(null)
    const db = getFirestore()
    const mutate = async (data)=>{
        setLoading(true)
        try{
            var ref = null

            if(data.id){
                ref = doc(db,'products/'+productid+'/product_orders/'+data.id)
                const productorderid = data.id+""
                delete data.id
                await updateDoc(ref,data)
                setResult(productorderid)
                return productorderid
            }else{
                if(!data.used)
                    data.used = 0
                if(!data.wasted)
                    data.wasted = 0
                const snap = await addDoc(collection(db,'products/'+productid+'/product_orders'),data)
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

export const AddUpdateProduct = ()=>{

    const [result,setResult] = useState(null)
    const [error,setError] = useState(null)
    const [loading,setLoading] = useState(null)
    const db = getFirestore()
    const mutate = async (data)=>{
        setLoading(true)
        try{
            var ref = null

            if(data.id){
                ref = doc(db,'products',(data.id))
                const productid = data.id+""
                delete data.id
                await updateDoc(ref,data)
                setResult(productid)
                return productid
            }else{
                if(!data.stockQuantity)
                    data.stockQuantity = 0
                const snap = await addDoc(collection(db,'products'),data)
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