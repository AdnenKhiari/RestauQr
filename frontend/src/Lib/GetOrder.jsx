import { collection, doc, getDoc, getDocs, getFirestore, query, where } from "firebase/firestore"
import { useEffect } from "react"
import { useState } from "react"
import { useParams } from "react-router"
import { computePrice } from "./util"
import hash from "object-hash"

const GetOrder = ()=>{
    const db = getFirestore()
    const [order,setOrder] = useState(null)
    const [error,setError] = useState(null)
    const {tableid} = useParams()
    const getOrder = async ()=>{
        if(isNaN(parseInt(tableid)))
            setError({error: "Invalid Table Id"})
        try{
            const qr = query(collection(db,'orders'),where("tableid","==",parseInt(tableid)),where("status","not-in",["canceled","accomplished"])) 
            const all_dt = (await getDocs(qr))
            if(all_dt.docs.length > 0){
                const rr = all_dt.docs[0]
                const data = rr.data()
                data.food = await Promise.all(data.food.map(async (fd)=>{
                    const fd_snap= await getDoc(doc(collection(db,'food'),fd.id))
                    if(fd_snap.exists()){
                        //complete data with img etc
                        const data = fd_snap.data()
                        const cartid = hash({options: fd.options,id : fd.id})
                        
                        const cart_food = {...data,
                            id: fd_snap.id,
                            options: fd.options,
                            count: fd.count,
                            price : computePrice(data,fd.options),
                            cartid: cartid
                        }
                        console.log(cart_food)
                        return cart_food
                    }
                    else
                        throw Error("Invalid Food ID")
                }))
                setOrder({cart : data.food,status: data.status,id: rr.id})
            }else{
                setOrder({cart:[]})
            }

        }catch(err){
            setError(err)
        }
    }
    useEffect(()=>{
        getOrder()
    },[tableid])
    console.log(order)
    return {order,setOrder,loading : !order && !error,error}
}
export default GetOrder