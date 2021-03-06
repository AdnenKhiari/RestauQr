import { useCallback, useEffect, useState } from "react"
import {getFirestore,doc, updateDoc, addDoc, collection, getDoc, setDoc, getDocs, query, where, deleteDoc, increment, runTransaction, getDocsFromServer, arrayRemove} from "firebase/firestore"
import { getInsTime } from "./utils"

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

export const ConsumeProductOrderItem = (productid,orderid) => {
    const [result,setResult] = useState(null)
    const [error,setError] = useState(null)
    const [loading,setLoading] = useState(null)
    const db = getFirestore()
    const mutate = async (data,updateGlobally = false)=>{
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
                })
                if(updateGlobally)
                    tr.update(prodref,{
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

export const ConsumeProductItem = (productid) => {
    const [result,setResult] = useState(null)
    const [error,setError] = useState(null)
    const [loading,setLoading] = useState(null)
    const db = getFirestore()
    const mutate = async (data)=>{
        setLoading(true)
        try{
            const prodref = doc(db,`products/${productid}`)
                
            await runTransaction(db,async (tr)=>{
                const snap = await tr.get(prodref)
                const cur = snap.data()
                if(data.used + data.wasted > cur.stockQuantity ){
                    throw Error("Invalid Query,Exceeded maximum capacity")
                }
                tr.update(prodref,{
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
    const verifyId = (ing)=>{
        if(ing.products){            
            if(ing.products.filter((p)=>p.id === productid).length > 0){
                return false
            }else{
                let result = true
                ing.options.forEach((opt)=>{
                    if(opt.type === 'check'){
                        result = result &&  verifyId(opt.ingredients)
                    }else if(opt.type === "select"){
                        opt.choices.forEach((choice)=>{
                            result = result &&  verifyId(choice.ingredients)
                        })
                    }
                })
                return result
            }
        }
    }
    const remove = async ()=>{
        setLoading(true)
        try{
            const ref = doc(db,'products/'+productid)
            const orders = collection(db,'products/'+productid+"/product_orders")
            const food_ref = collection(db,'food')

            let allfood = await getDocsFromServer(food_ref);

            allfood.forEach((item)=>{
                const food = item.data()
                if(!verifyId(food.ingredients))
                    throw Error("Product In Use In Food "+food.title)
            })

            allfood = null;
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
            console.log("IDD",data.id)

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

                    const new_quantity = data.unitQuantity * data.productQuantity
                    const old_quantity = old_ord_data.unitQuantity * old_ord_data.productQuantity
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

const updateFoodProducts = (cur,data,productid)=>{
    if(cur.ingredients){
            if(cur.ingredients.products)
            cur.ingredients.products.forEach(prod=>{
                if(prod.id.trim() === productid.trim()){
                    prod.name = data.name
                    prod.sellingUnitPrice = data.sellingUnitPrice
                    prod.unit = data.unit
                    prod.unitQuantity = data.unitQuantity
                }
            })
            if(cur.ingredients.options)
            cur.ingredients.options.forEach((opt)=>{
                if(opt.type==="select"){
                    opt.choices.forEach((select)=>{
                       // console.log("Select",select)
                       updateFoodProducts(select,data,productid)
                    })
                }else{
                   // console.log("Check",opt)
                   updateFoodProducts(opt,data,productid)   
                }
            })
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
                const allfood = (await getDocs(collection(db,"food"))).docs.map((fd)=>{return {id: fd.id,...fd.data()}})
                allfood.forEach((fd)=>{
                    updateFoodProducts(fd,data,productid)
                })
                console.log("All FOOD",allfood)
                delete data.id

                await runTransaction(db,async tr =>{
                    allfood.forEach((fd)=>{
                        tr.update(doc(collection(db,"food"),fd.id),fd)
                    })
                    tr.update(ref,data)

                })
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