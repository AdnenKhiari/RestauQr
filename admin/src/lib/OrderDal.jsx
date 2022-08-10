import  {collection, deleteField, doc, getDoc, increment,getFirestore, runTransaction, updateDoc, getDocs, arrayUnion} from "firebase/firestore"
import { useState } from "react"
import { useEffect } from "react"
import {getMessaging} from "firebase/messaging"
import { getTodayDate } from "./utils"

//Temporarly using the firebase admin sdk

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

            const global_stats_ref = collection(db,'global_stats')
            const today_stats = doc(global_stats_ref,getTodayDate())
            const all_subs = collection(db,'orders/'+id+'/sub_orders')
            const all_data = await getDocs(all_subs)
            console.log(all_data.docs.map((val)=>val.data()))
    
            if(st === 'paid' && (all_data.docs.length !== 0 && all_data.docs.map((item)=>item.data()).some(item=>item.status !== "accomplished" && item.status !== 'canceled')))
                throw Error("Please Validate Sub Orders First")

            await runTransaction(db,async tr=>{
                const current_ref = doc(db,'orders',id)
                
                tr.update(current_ref,{
                    status: st
                })
                const pr = await getDoc(current_ref)
                if(!pr.exists())
                    throw Error('Order Not Found')
                const pr_dt = pr.data()
                if(st === 'paid'){
                    tr.set(today_stats,{
                        orders: increment(1),
                        success: increment(1),
                        total: increment(pr_dt.price),
                        date: new Date(),
                        events: arrayUnion({
                            date: new Date(),
                            foodcount: pr_dt.foodcount
                        })
                    },{merge: true})
                }
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
    const msg = getMessaging()


    
    const upd = async (st,current,reason)=>{
        try{
            setLoading(true)
            if(current.status === st)
                return;
            const cur_ord = doc(db,'orders/'+orderid)
            const dt = {
                status: st,
                reason: deleteField()   
            }
            if(reason)
                dt.reason = reason

            const del = current.status === "accomplished" && st === "canceled"
            const add  = current.status === "pending" && st === "accomplished"
            const usage = {}
            if(add || del)
                current.food.forEach((fd)=>{
                    if(fd.ingredients)
                        computeUsage(fd.ingredients,fd.options,usage,fd.count)
                })
            const global_stats_ref = collection(db,'global_stats')
            const today_stats = doc(global_stats_ref,getTodayDate())
            await runTransaction(db,async tr =>{
                const cur_ord_data = (await tr.get(cur_ord)).data()
                if(cur_ord_data.status === 'paid' && st === 'canceled')
                    throw Error("Order Already Paid")
                tr.update(doc(db,`orders/${orderid}/sub_orders/${subid}`),dt)
                if(st === 'canceled'){
                    if(cur_ord_data.price > current.price){
                        tr.update(cur_ord,{
                            price: increment(-current.price),
                            foodcount: increment(-current.food.reduce((init,fd)=>init+fd.count,0))
                        })
                    }else{

                        tr.update(cur_ord,{
                            price: increment(-current.price),
                            foodcount: 0,
                            status: 'canceled'
                        })
                        // Decrease the stats cause of canceled order
                        tr.set(today_stats,{
                            success: increment(-1),
                            canceled: increment(1),
                            total: increment(-current.price),
                        },{merge: true})
                        
                    }
                }

                if(add || del){
                    Object.keys(usage).forEach((id)=>{
                        console.log(id)
                        const ref = doc(collection(db,'products'),id)
                        const stat_ref =  doc(collection(db,'products/'+id+'/orders_stats/'),getTodayDate())

                        if(add){
                            tr.update(ref,{
                                stockQuantity: increment(-usage[id])
                            })
                            tr.set(stat_ref,{
                                used: increment(usage[id])
                            },{merge: true})
                        }
                        if(del){
                            tr.set(stat_ref,{
                                used: increment(-usage[id]),
                                wasted: increment(usage[id])
                            },{merge: true})    
                         }
                    })
                }

              /*  const current_order = await tr.get(cur_ord)
                if(!current_order.exists()){
                    throw Error("Does Not Exists")
                }*/

            })
            

        }catch(err){
            setError(err)
            throw err
        }finally{
            setLoading(false)
        }
    }

    return {
        mutate: upd,
        error
    }
}