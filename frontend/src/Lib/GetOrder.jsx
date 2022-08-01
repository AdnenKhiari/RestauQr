import { collection, doc, getDoc, getDocs, getFirestore, query, where } from "firebase/firestore"
import { useEffect } from "react"
import { useState } from "react"
import { useParams } from "react-router"
import { computePrice, hashFood } from "./util"
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
            const qr = query(collection(db,'orders'),where("tableid","==",parseInt(tableid)),where("status","==","unpaid")) 
            const all_dt = (await getDocs(qr))
            if(all_dt.docs.length > 0){
                const rr = all_dt.docs[0]
                const order_data = {id: rr.id,...rr.data()}
                const sub_orders  = await getDocs(collection(db,`orders/${order_data.id}/sub_orders`))
                if(sub_orders.docs.length === 0)
                    throw Error("Sub Orders Not Found")
                order_data.cart = sub_orders.docs.map((sub,index)=>{
                    const sub_data = {...sub.data(),id: sub.id}
                    return {
                    food: sub_data.food.map((fd)=>{return{
                        ...fd,
                        cartid: hashFood(fd.id,fd.options),
                    }}),
                    status: sub_data.status,
                    id: sub_data.id,
                    price: sub_data.price
                }
                })
                if(order_data.cart[order_data.cart.length - 1].status !== "Waiting")
                    order_data.cart.push({food: []})
                setOrder(order_data)
                console.log(order_data)
            }else{
                setOrder({cart:[{food: []}]})
            }

        }catch(err){
            setError(err)
        }
    }
    useEffect(()=>{
        getOrder()
    },[tableid])
    console.log(order)
    return {order,setOrder,loading : !order && !error,error,getOrder}
}
export default GetOrder