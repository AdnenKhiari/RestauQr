import { collection, doc, getDoc, getDocs, getFirestore, query, where } from "firebase/firestore"
import { useEffect } from "react"
import { useState } from "react"
import { useParams } from "react-router"
import { computePrice, hashFood } from "./util"
import hash from "object-hash"
import {useQuery} from "react-query"
import axios from "axios"
import APIROUTES from "../Routes/API"
const GetOrder = ()=>{
    const [order,setOrder] = useState(null)
    const [error,setError] = useState(null)
    const {tableid} = useParams()
    const {data:result,isLoading,error: query_error,refetch} = useQuery(["current-order"],async ()=>{
        const res = await axios.get(APIROUTES.GET_CURRENT_ORDER_BY_TABLE(tableid))
        return res.data
    },{
        retry: 4,
        enabled: false,
        refetchOnWindowFocus: false
    })
    console.warn("Current Order",result,isLoading,query_error)
    const getOrder = async ()=>{
        if(isNaN(parseInt(tableid)))
            setError({error: "Invalid Table Id"})
        try{
           const result =  (await refetch())
            const order_info =result.data.data
            if(order_info.order){
                const order_data = order_info.order
                const sub_orders  = order_info.sub_orders
                if(sub_orders.length === 0)
                    throw Error("Sub Orders Not Found")
                order_data.cart = sub_orders.map((sub_data,index)=>{
                    return {
                    food: sub_data.food.map((fd)=>{return{
                        ...fd,
                        cartid: hashFood(fd.id,fd.options),
                    }}),
                    status: sub_data.status,
                    id: sub_data.id,
                    reason: sub_data.reason,
                    price: sub_data.price
                }
                })
                if(order_data.cart[order_data.cart.length - 1].status !== "waiting")
                    order_data.cart.push({food: []})
                setOrder(order_data)
                console.log(order_data)
            }else{
                setOrder({cart:[{food: []}],tokens: [],tableid: tableid})
            }
        }catch(err){
            setError(err)
        }
    }
    useEffect(()=>{
        getOrder()
    },[])
    useEffect(()=>{
        setError(query_error)
    },[query_error])
    
    return {order,setOrder,loading : !order && !error,error,getOrder}
}
export default GetOrder