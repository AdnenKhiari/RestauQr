import  {collection, deleteField, doc, getDoc, increment,getFirestore, runTransaction, updateDoc} from "firebase/firestore"
import { useState } from "react"
import { useEffect } from "react"


export const GetOrderById = (id)=>{

    const [result,setResult] = useState(null)
    const [error,setError] = useState(null)
    const db = getFirestore()

    const fetch = async ()=>{
        try{
            const order = await getDoc(doc(db,'orders',id))
            if(order.exists()){
                const order_data = order.data()
                setResult({id : order.id,...order_data})
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

export const GetSubOrderById = (orderid,subid)=>{

    const [result,setResult] = useState(null)
    const [error,setError] = useState(null)
    const db = getFirestore()

    const fetch = async ()=>{
        try{
            const order = await getDoc(doc(db,`orders/${orderid}/sub_orders/${subid}`))
            if(order.exists()){
                const order_data = order.data()
                setResult({id : order.id,...order_data})
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

export const UpdateOrder = (id)=>{

    const [error,setError] = useState(null)
    const db = getFirestore()

    const fetch = async (st)=>{
        try{

            const order = await updateDoc(doc(db,'orders',id),{
                status: st
            })
        }catch(err){
            setError(err)
        }
    }

    return {
        mutate: fetch,
        error
    }
}

const computeUsage = (fd,selectedopts,hs,count)=>{
    console.log("Hi i'm",fd,"and explrong",selectedopts,"with",hs,"coundt",count)
    if(fd.products){
        fd.products.forEach((prd)=>{
            if(!hs[prd.id])
                hs[prd.id] = 0
            hs[prd.id] += prd.quantity * count
        })
    }
    if(fd.options)
        fd.options.forEach((opt)=>{
            let selected = null
            if(opt.type === 'select'){
                selected = opt.choices.find(choice => selectedopts && selectedopts.find(d => d.value === choice.msg) !== undefined)               
                selected = selectedopts && selectedopts.find(d => d.value === selected.msg)
                opt = opt.choices.find(c => c.msg === selected.value)
            } else{
                selected = selectedopts && selectedopts.find(d => d.name === opt.msg)
            }     
            console.log("currently",opt,"Seraching for my option and found",selected)
        
            const valid = selected && selected.value
            if(opt.ingredients && valid){   
                console.log("Valid ",selected)
                computeUsage(opt.ingredients,selected.ingredients ? selected.ingredients.options : [],hs,count)
            }
        })
}

export const UpdateSubOrder = (orderid,subid)=>{

    const [error,setError] = useState(null)
    const [loading,setLoading] = useState(null)
    const db = getFirestore()
    const fetch = async (st,current,reason)=>{
        try{
            setLoading(true)
            const cur_ord = doc(db,'orders/'+orderid)
            const dt = {
                status: st,
                reason: deleteField()   
            }
            if(reason)
                dt.reason = reason

            const add = current.status === "accomplished" && st === "canceled"
            const del  = current.status === "pending" && st === "accomplished"
            const usage = {}
            if(add || del)
                current.food.forEach((fd)=>{
                    if(fd.ingredients)
                        computeUsage(fd.ingredients,fd.options,usage,fd.count)
                })

            await runTransaction(db,async tr =>{
                tr.update(doc(db,`orders/${orderid}/sub_orders/${subid}`),dt)

                if(st === 'canceled'){
                    /*const ord = await tr.get(cur_ord)
                    if(!ord.exists())
                        throw Error("Order Not Found")
*/
                    tr.update(cur_ord,{
                        price: increment(-current.price)
                    })
                }

                if(add || del){
                    Object.keys(usage).forEach((id)=>{
                        console.log(id)
                        const ref = doc(collection(db,'products'),id)
                        //should add wasted and used per day for aggregation
                        if(add){
                            tr.update(ref,{
                                stockQuantity: increment(-usage[id])
                            })
                        }
                        if(del){
                            //should transfer the used to wasted 
                        }
                    })
                }
            })

        }catch(err){
            setError(err)
            throw err
        }finally{
            setLoading(false)
        }
    }

    return {
        mutate: fetch,
        error
    }
}