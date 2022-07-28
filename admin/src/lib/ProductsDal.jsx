import { useCallback, useEffect, useState } from "react"
import {getFirestore,doc, updateDoc, addDoc, collection, getDoc, setDoc, getDocs, query, where, deleteDoc, increment, runTransaction, getDocsFromServer} from "firebase/firestore"

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
            const docref = doc(db,`products/${productid}/product_orders/${orderid}`)
            const prodref = doc(db,`products/${productid}`)
            await runTransaction(db,async (tr)=>{
                const snap = await tr.get(docref)
                if(!snap.exists()){
                    throw Error("Invalid IDs")
                }
                const cur = snap.data()
                if(cur.used + data.used < 0 || cur.wasted + data.wasted < 0){
                    throw Error("Invalid Query,the wasted and used total ammounts cannot be negative")
                }
                if(cur.used + data.used + cur.wasted + data.wasted  > cur.productQuantity * cur.unitQuantity){
                    throw Error("Invalid Query,Exceeded maximum capacity")
                }
                tr.update(docref,{
                    used: increment(data.used),
                    wasted: increment(data.wasted),
                }).update(prodref,{
                    stockQuantity: increment(-(data.used + data.wasted))
                })
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

export const RemoveProduct = (productid)=>{
    const [result,setResult] = useState(null)
    const [error,setError] = useState(null)
    const [loading,setLoading] = useState(null)
    const db  = getFirestore()

    const remove = async ()=>{
        setLoading(true)
        try{
            const ref = doc(db,'products/'+productid)
            const orders = collection(db,'products/'+productid+"/product_orders")
            const alldocs = await getDocsFromServer(orders)
            runTransaction(db,async (tr)=>{
                alldocs.forEach((element)=>{
                    tr.delete(element.ref)
                })
                tr.delete(ref)
            })
            setResult(true)
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
        remove
    }
}

export const RemoveProductOrder = (productid,orderid)=>{
    const [result,setResult] = useState(null)
    const [error,setError] = useState(null)
    const [loading,setLoading] = useState(null)
    const db  = getFirestore()

    const remove = async ()=>{
        setLoading(true)
        try{
            let quan = 0
            const ref = doc(db,'products/'+productid+'/product_orders/'+orderid)
            runTransaction(db,async (tr)=>{
                const snap = await tr.get(ref)
                if(!snap.exists())
                    throw Error("Invalid Id")
                const data = snap.data()
                quan = data.unitQuantity * data.productQuantity - (data.used + data.wasted)
                tr.delete(ref).update(doc(db,'products/'+productid),{
                    stockQuantity: increment(-quan)
                })
            })
            setResult(true)
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
        remove
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
            const prodref = doc(db,'products/'+productid)
            if(data.id){
                const ref = doc(db,'products/'+productid+'/product_orders/'+data.id)
                const productorderid = data.id+""
                delete data.id
                await runTransaction(db,async (tr)=>{

                    const old_prod = (await tr.get(prodref))
                    if(!old_prod.exists())
                        throw Error("Invalid Product Id")
                    const old_prod_data = old_prod.data()

                    const old_ord = (await tr.get(ref))
                    if(!old_ord.exists())
                        throw Error("Invalid Order Id")
                    const old_ord_data = old_ord.data()

                    const new_quantity = data.unitQuantity * data.productQuantity - (data.used + data.wasted)
                    const old_quantity = old_ord_data.unitQuantity * old_ord_data.productQuantity - (old_ord_data.used + old_ord_data.wasted)
                    const diff = new_quantity - old_quantity
                    if(-diff > old_prod_data.stockQuantity )
                        throw Error("Exceeded maximum Capacity")
                    tr.update(ref,data).update(prodref,{
                        stockQuantity: increment(diff)
                    })
                })
                setResult(productorderid)
                return productorderid
            }else{
                data = {...data,used: 0,wasted: 0}
                const stockadd =  (data.unitQuantity * data.productQuantity - (data.used + data.wasted))
                const ref = doc(collection(db,'products/'+productid+'/product_orders'))
                await runTransaction(db,async (tr)=>{
                    tr.set(ref,data).update(prodref,{stockQuantity: increment(stockadd)})
                })
                setResult(ref.id)
                return ref.id 
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