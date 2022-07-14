import { useEffect, useState } from "react"
import {doc, getDoc, getFirestore} from "firebase/firestore"
const GetCategories = ()=>{

    const [result,setResult] = useState(null)
    const [error,setError] = useState(null)
    const db = getFirestore()

    const fetch = async ()=>{
        try{
            const menu = await getDoc(doc(db,'utils','menu'))
            if(menu.exists()){
                const menu_data = menu.data()
                setResult(menu_data.categories)
            }else{
                throw new Error('Categories not found')
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
export default GetCategories