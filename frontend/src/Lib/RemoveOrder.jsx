import { collection, deleteDoc, doc, getFirestore, runTransaction, updateDoc } from "firebase/firestore"
import { useCallback, useContext } from "react"
import { useParams } from "react-router"
import { OrderContext } from "../Components/Contexts"

const RemoveOrder = ()=>{
    const db = getFirestore()
    const [order,setOrder] = useContext(OrderContext)
    const {tableid} = useParams()
    const removeOrder = useCallback(async (ordernum)=>{
        const order_col = collection(db,'orders')
        try{
            await runTransaction(db,async tr =>{
                const dd = doc(order_col,`${order.id}/sub_orders/${order.cart[ordernum].id}`)
                const dt = await tr.get(dd)
                if(!dt.exists())
                    throw Error("Could not retrieve cart information")
                const status = dt.data().status
                if(status !== "Waiting")
                    throw Error("Request Already Pending")
                tr.delete(dd)
                order.cart.splice(ordernum,1)
                setOrder({...order})
            })
        }catch(err){
            console.log(err)
        }
    },[order,db,setOrder,tableid])
    return removeOrder
}
export default RemoveOrder