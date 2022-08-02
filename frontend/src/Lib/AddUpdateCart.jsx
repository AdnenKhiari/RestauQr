import { addDoc, collection, doc, getDoc, getFirestore, increment, Increment, runTransaction, setDoc, updateDoc } from "firebase/firestore"
import { useCallback } from "react"
import { useContext } from "react"
import { useParams } from "react-router"
import { OrderContext } from "../Components/Contexts"
import { hashFood } from "./util"

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
                        price: 0
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
                        price: increment(cartitem.price)
                    })
                }else{
                    sub_doc = doc(suborders_col,cartitem.id)
                    const old = await tr.get(sub_doc)
                    if(!old.exists())
                        throw Error('Invalid Error Id')
                    const oldprice = old.data().price
                    console.log(oldprice)
                    if(old.data().status === "waiting"){
                        console.log(cartitem.food,cartitem.price,cartitem.price,oldprice, increment(cartitem.price - oldprice))
                        tr.update(sub_doc,{
                            food: cartitem.food,
                            price: cartitem.price
                        })
                        tr.update(order_doc,{
                            price: increment(cartitem.price - oldprice)
                        })
                    }else{
                        throw Error("Command Pending ...")
                    }
                }
            })
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
export default AddUpdateCart