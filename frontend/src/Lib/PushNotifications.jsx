import {getMessaging,getToken, onMessage} from "firebase/messaging"
import {arrayUnion, doc, getFirestore, updateDoc} from "firebase/firestore"

import { useContext } from "react"
import { useEffect } from "react"
import {NotificationsContext, OrderContext} from "../Components/Contexts"
import {useMutation, useQuery} from "react-query"
import axios from "axios"
import {useParams} from "react-router-dom"
import APIROUTES from "../Routes/API"
export const GetToken = ()=>{
    const msg = getMessaging()
    const [order,setOrder] = useContext(OrderContext)
    const mutator = useMutation(async (data)=>{
        const res = await axios.put(APIROUTES.ADD_TOKEN_TO_CURRENT(data.orderid),{token: data.token})
        return res.data
    })
    const addTokenToServer = async (token)=>{
        console.log("VASP TOKEN ",token)
        await mutator.mutateAsync({token,orderid: order.id})
    }
    const loadToken = async ()=>{
        try{
            if("serviceWorker" in navigator){
                const token = await getToken(msg,{vapidKey: "BMOG5BnPqCexifL-a8A6pBVXa7CZwEHSWcg9DBQrmAG6Y7VIvQn3c_c7MBjC0xujCrNaBvOW1rbjELn5tmvCmNw"})
                console.log(token,order)
                if(order && order.id){
                    await addTokenToServer(token)
                }
                if(order){
                    if(!order.tokens)
                        order.tokens = []
                    order.tokens.push(token)
                    setOrder({...order})
                }
            }else{
                throw Error("Service Worker Not Found lel")
            }
        }catch(err){
            console.log("PUSH ERR",err)
        }
    }
    useEffect(()=>{
        loadToken()
    },[order && order.id])
}

export const GetPushMessages = ()=>{
    const msg = getMessaging()
    const [notifications,setNotifications] = useContext(NotificationsContext)
    useEffect(()=>{
        const unsub = onMessage(msg,(payload)=>{
            console.log("pay",notifications,payload)
            setNotifications([...notifications,payload.notification])
        })
        return unsub
    },[notifications,setNotifications])
}