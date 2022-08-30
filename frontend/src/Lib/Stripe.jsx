import {useQuery} from "react-query"
import APIROUTES from "../Routes/API"
import axios from "axios"

export const GetClientSecret = ()=>{
    const {data: result,isLoading,error} = useQuery(["stripe-payment-secret"],async ()=>{
        const res = await axios(APIROUTES.GET_STRIPE_CLIENT_SECRET,{
            withCredentials: true
        })
        return res.data
    },{onSuccess: (result)=>{
        //setOptions({clientSecret: secret,appearance: appearance})
        console.warn("SECRET",result)
    },
    retry: 0,
    refetchOnWindowFocus: 0
})
    return {
        data: result && result.data.client_secret,
        loading: isLoading,
        error: error
    }
}