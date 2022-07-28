import { useCallback, useEffect, useState } from "react"
import {getFirestore,doc, updateDoc, addDoc, collection, getDoc, setDoc, getDocs, query, where, deleteDoc, increment} from "firebase/firestore"

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

export const GetProductOrderById = (productid,orderid)=>{

    const [result,setResult] = useState(null)
    const [error,setError] = useState(null)
    const db = getFirestore()   
    console.log(`products/${productid}/product_orders/${orderid}`)
    const fetch = async ()=>{
        try{
            const po = await getDoc(doc(db,`products/${productid}/product_orders/${orderid}`))
            if(po.exists()){
                const po_data = po.data()
                const id = po.id
                setResult({id,...po_data})
            }else{
                throw new Error('Invalid Item Id')
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

export const ConsumeProductItem = (productid,orderid) => {
    const [result,setResult] = useState(null)
    const [error,setError] = useState(null)
    const [loading,setLoading] = useState(null)
    const db = getFirestore()
    const mutate = async (data)=>{
        setLoading(true)
        try{
            await updateDoc(doc(db,`products/${productid}/product_orders/${orderid}`),{
                used: increment(data.used),
                wasted: increment(data.wasted),
            })
            setResult(true)
            return true
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