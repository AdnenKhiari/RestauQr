import { collection, deleteDoc, doc, getFirestore, increment, runTransaction, updateDoc } from "firebase/firestore"
import { useCallback, useContext } from "react"
import { useParams } from "react-router"
import { OrderContext } from "../Components/Contexts"
import {useMutation, useQuery} from "react-query"
import axios from "axios"
import APIROUTES from "../Routes/API"
const RemoveOrder = ()=>{
    const db = getFirestore()
    const [order,setOrder] = useContext(OrderContext)
    const {tableid} = useParams()

    const {data:result,isLoading,error: query_error,mutateAsync} = useMutation(async (data)=>{
        const res = await axios.delete(APIROUTES.REMOVE_ORDER(data.orderid,data.subid))
        return res.data
    },{
        retry: 0
    })

    const removeOrder = useCallback(async (ordernum)=>{
        try{
            const toremove = await (await mutateAsync({orderid: order.id,subid: order.cart[ordernum].id})).data.data
            if(toremove){
                setOrder({cart: [{food: []}],tokens:[],tableid: tableid})
            }else{
                order.price -= order.cart[ordernum].price
                order.cart.splice(ordernum,1)
                setOrder({...order})
            }
        }catch(err){
            console.log(err)
        }
    },[mutateAsync,order,setOrder])


    return removeOrder
}
export default RemoveOrder