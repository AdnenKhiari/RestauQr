import  { doc, getDoc, getFirestore, updateDoc} from "firebase/firestore"
import { useState } from "react"
import { useEffect } from "react"
export const GetOrderById = (id)=>{

    const [result,setResult] = useState(null)
    const [error,setError] = useState(null)
    const db = getFirestore()

    const fetch = async ()=>{
        try{
            const order = await getDoc(doc(db,'orders',id))
            if(order.exists()){
                const order_data = order.data()
                order_data.food = await Promise.all(order_data.food.map(async (fd)=>{
                    const food = await getDoc(doc(db,'food',fd.id))
                    if(!food.exists())
                        return Promise.reject('Invalid Food Id')
                    const food_data = food.data()
                    food_data.options = {}
                    return {...food_data,...fd}
                }))
                setResult({id : order.id,...order_data})
            }else{
                throw new Error('Invalid Id')
            }
        }catch(err){
            setError(err)
        }
    }
    useEffect(()=>{
        fetch()
    },[db])
    return {
        result,
        error,
        loading: !result && !error
    }
}

export const UpdateOrder = (id)=>{

    const [error,setError] = useState(null)
    const db = getFirestore()

    const fetch = async (st)=>{
        try{
            const order = await updateDoc(doc(db,'orders',id),{
                status: st
            })
        }catch(err){
            setError(err)
        }
    }

    return {
        mutate: fetch,
        error
    }
}
