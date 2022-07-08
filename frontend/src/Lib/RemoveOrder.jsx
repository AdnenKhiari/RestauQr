import { collection, deleteDoc, doc, getFirestore, updateDoc } from "firebase/firestore"
import { useCallback, useContext } from "react"
import { useParams } from "react-router"
import { OrderContext } from "../Components/Contexts"

const RemoveOrder = ()=>{
    const db = getFirestore()
    const [order,setOrder] = useContext(OrderContext)
    const {tableid} = useParams()
    const removeOrder = useCallback(async (cart)=>{
        if(!order.id)
            return;
        const order_col = collection(db,'orders')
        await updateDoc(doc(order_col,order.id),{status: "canceled"})
        setOrder({cart:[]})
    },[order,db,setOrder,tableid])
    return removeOrder
}
export default RemoveOrder