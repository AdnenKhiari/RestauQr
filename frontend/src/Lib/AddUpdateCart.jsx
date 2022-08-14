import { addDoc, collection, doc, getDoc, getFirestore, increment, Increment, runTransaction, setDoc, updateDoc } from "firebase/firestore"
import { useCallback } from "react"
import { useContext } from "react"
import { useParams } from "react-router"
import { OrderContext } from "../Components/Contexts"
import { hashFood } from "./util"
import axios from "axios"
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
  } from 'react-query'
/*
const AddUpdateCart = ()=>{
    const db = getFirestore()
    const [order,setOrder,getOrder] = useContext(OrderContext)
    const {tableid} = useParams()
    const updateOrder = useCallback(async (cartitem,ordernum = 0)=>{
        console.log("The Cart on server will be ",structuredClone(cartitem))
        
        const order_col = collection(db,'orders')
        let order_doc = doc(order_col)
        let sub_doc = null
        try{
        
            await runTransaction(db,async tr =>{
                if(!order.id){
                    tr.set(order_doc,{
                        status: "unpaid",
                        tableid : parseInt(tableid),
                        time: new Date(),
                        price: 0,
                        foodcount: 0
                    })
                }else{
                    order_doc = doc(order_col,order.id)
                }
                console.log("YU MODIFIED",cartitem)
                const suborders_col = collection(db,'orders/'+order_doc.id+"/sub_orders")
                if(!cartitem.id){
                    sub_doc = doc(suborders_col)
                    tr.set(sub_doc,{
                        food: cartitem.food,    
                        price: cartitem.price,
                        time: new Date(),
                        status: "waiting",
                        tableid: tableid,
                        order_ref: order_doc.id
                    }).update(order_doc,{
                        price: increment(cartitem.price),
                        foodcount: increment(cartitem.food.reduce((init,fd)=>fd.count + init,0))
                    })
                }else{
                    sub_doc = doc(suborders_col,cartitem.id)
                    const old = await tr.get(sub_doc)
                    if(!old.exists())
                        throw Error('Invalid Error Id')
                    const old_pr = old.data()
                    const oldprice = old_pr.price
                    console.log(oldprice)
                    if(old.data().status === "waiting"){
                        console.log(cartitem.food,cartitem.price,cartitem.price,oldprice, increment(cartitem.price - oldprice))
                        tr.update(sub_doc,{
                            food: cartitem.food,
                            price: cartitem.price
                        })
                        tr.update(order_doc,{
                            price: increment(cartitem.price - oldprice),
                            foodcount: increment(-old_pr.food.reduce((init,fd)=>fd.count + init,0) + cartitem.food.reduce((init,fd)=>fd.count + init,0))
                        })
                    }else{
                        throw Error("Command Pending ...")
                    }
                }
            })

            // End of the API part
            // More Than Optimistic Update
            if(!order.id)
                order.price = 0
            if(!cartitem.id){
                order.price += cartitem.price
            }else{
                order.price += -order.cart[ordernum].price + cartitem.price   
            }
            order.cart[ordernum] = {
                id: sub_doc.id,
                food: cartitem.food.map((fd)=>{
                    fd.cartid= hashFood(fd.id,fd.options)
                    return fd
                }),
                price: cartitem.price,
                status: cartitem.status ? cartitem.status : "waiting",
            }
            setOrder({...order,id: order_doc.id})
        }catch(err){
            console.log(err)
        }
    },[order,db,setOrder,tableid])
    return updateOrder
}
*/
const AddUpdateCart = ()=>{
    const [order,setOrder,getOrder] = useContext(OrderContext)
    const {tableid} = useParams()
    const dt = useMutation(async (data)=>{
        const res = await axios.post()
    })
    const updateOrder  = async (cartitem,ordernum = 0)=>{
//        console.log("The Cart on server will be ",structuredClone(cartitem))
        const sub_doc = null
        const result = null

        try{

            if(!order.id)
                //create order
            //addupdate the sub order

            // End of the API part
            // More Than Optimistic Update
            if(!order.id)
                order.price = 0
            if(!cartitem.id){
                order.price += cartitem.price
            }else{
                order.price += -order.cart[ordernum].price + cartitem.price   
            }
            order.cart[ordernum] = {
                id: sub_doc.id,
                food: cartitem.food.map((fd)=>{
                    fd.cartid= hashFood(fd.id,fd.options)
                    return fd
                }),
                price: cartitem.price,
                status: cartitem.status ? cartitem.status : "waiting",
            }
            setOrder({...order,id: result.id})
        }catch(err){
            console.log(err)
        }
    }
}
export default AddUpdateCart