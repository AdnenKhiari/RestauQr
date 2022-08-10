import { collection, deleteDoc, doc, getFirestore, increment, runTransaction, updateDoc } from "firebase/firestore"
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
            let toremove = false
            await runTransaction(db,async tr =>{
                const orderdoc = doc(order_col,order.id)
                const dd = doc(order_col,`${order.id}/sub_orders/${order.cart[ordernum].id}`)
                const dt = await tr.get(dd)
                if(!dt.exists())
                    throw Error("Could not retrieve cart information")
                const oldorder_data = dt.data()
                const status = oldorder_data.status
                const oldprice = oldorder_data.price
                if(status !== "waiting")
                    throw Error("Request Already Running")
                tr.delete(dd)
                if(order.price > oldprice){
                    tr.update(orderdoc,{
                        price: increment(-oldprice),
                        foodcount: increment(-oldorder_data.food.reduce((init,fd)=>fd.count + init,0))
                    })
                }else{
                    tr.delete(orderdoc)
                    toremove= true
                }
            })
            if(toremove){
                setOrder({cart: [{food: []}],tokens:[]})
            }else{
                order.price -= order.cart[ordernum].price
                order.cart.splice(ordernum,1)
                setOrder({...order})
            }
        }catch(err){
            console.log(err)
        }
    },[order,db,setOrder,tableid])
    return removeOrder
}
export default RemoveOrder