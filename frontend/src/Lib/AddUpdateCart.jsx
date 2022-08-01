import { addDoc, collection, doc, getDoc, getFirestore, runTransaction, setDoc, updateDoc } from "firebase/firestore"
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
                        tableid : parseInt(tableid)
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
                        status: "Waiting",
                        tableid: tableid,
                        order_ref: order_doc.id
                    })
                }else{
                    sub_doc = doc(suborders_col,cartitem.id)
                    const old = await tr.get(sub_doc)
                    if(!old.exists())
                        throw Error('Invalid Error Id')
                    if(old.data().status === "Waiting"){
                        tr.update(sub_doc,{
                            food: cartitem.food,
                            price: cartitem.price
                        })
                    }else{
                        throw Error("Command Pending ...")
                    }
                }
            })
            order.cart[ordernum] = {
                id: sub_doc.id,
                food: cartitem.food.map((fd)=>{
                    fd.cartid= hashFood(fd.id,fd.options)
                    return fd
                }),
                price: cartitem.price,
                status: cartitem.status ? cartitem.status : "Waiting",
            }
            setOrder({...order,id: order_doc.id})
        }catch(err){
            console.log(err)
        }
    },[order,db,setOrder,tableid])
    return updateOrder
}
export default AddUpdateCart