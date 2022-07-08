import { addDoc, collection, doc, getDoc, getFirestore, setDoc, updateDoc } from "firebase/firestore"
import { useCallback } from "react"
import { useContext } from "react"
import { useParams } from "react-router"
import { OrderContext } from "../Components/Contexts"

const UpdateCart = ()=>{
    const db = getFirestore()
    const [order,setOrder] = useContext(OrderContext)
    const {tableid} = useParams()
    const updateOrder = useCallback(async (cart)=>{
        const order_col = collection(db,'orders')
        var snapshot = null
        if(!order.id){
            const sent_order = await addDoc(order_col,{food : cart,status: 'waiting',tableid : parseInt(tableid),time: new Date() })
            snapshot = await getDoc(sent_order)
        }else{
            const old_order =  doc(order_col,order.id)
            const sent_order = await updateDoc(old_order,{food : cart,time: new Date() })
            snapshot = await getDoc(old_order)
        }
        const id = snapshot.id
        const data = snapshot.data()
        const new_order = {
            ...order,
            id: id,
            status: data.status
        }
        setOrder(new_order)
    },[order,db,setOrder,tableid])
    return updateOrder
}
export default UpdateCart