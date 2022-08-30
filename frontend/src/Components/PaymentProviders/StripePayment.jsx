import { useState } from "react"
import {loadStripe} from "@stripe/stripe-js"
import {Elements,PaymentElement, useElements, useStripe} from "@stripe/react-stripe-js"
import { GetClientSecret } from "../../Lib/Stripe"
import { useEffect } from "react"

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY)
const appearance = {
    theme: 'stripe',
    variables: {
        colorPrimary:"#FFCC1D",
        colorBackground: "#FFFF",
        colorText: "black"  ,
        fontFamily: 'Lato ,sans-serif',
        colorDanger: "red"
    },
    rules: {
        '.Label': {
            color: "#FFCC1D",
            fontSize: "1.5rem",
            fontFamily: 'Dancing Script ,cursive'
        },
        '.RedirectText' : {
            color: "#FFCC1D"
        }
    }
  };
const StripePayment = ()=>{
    const [options,setOptions] = useState(null)
    const {data: secret,loading,error} = GetClientSecret()
    useEffect(()=>{
        if(secret)
            setOptions({
                clientSecret: secret,
                appearance: appearance
            })
    },[secret])
    return options ? <Elements stripe={stripePromise} options={options}>
        <StripePaymentUi options={options} />   
    </Elements> : <p>Loading ...</p>
}
const StripePaymentUi = ({options})=>{
    const elements = useElements()
    const stripe = useStripe()
    const [loading,setLoading] = useState(false)
    const [errmsg,setErrmsg] = useState(false)

    const handleSubmit = async (e)=>{
        e.preventDefault()
        if(!elements || ! stripe)
            return
        setLoading(true)
        setErrmsg(null)
        const {error} = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: "http://localhost:3000/payment/confirmStripe"
            }
        })
        if(error)
            console.log("Stripe erer",error)
        if (error.type === "card_error" || error.type === "validation_error") {
            setErrmsg(error.message);
        } else {
            setErrmsg("An unexpected error occurred.");
        }
        setLoading(false)
    }
    return  <form className="stripe-form" onSubmit={handleSubmit}>
            <PaymentElement />
            <button>Pay</button>
            {loading && <h1>Loading ...</h1>}
            {errmsg && <p className="error">{errmsg}</p>}
        </form>
}

export default StripePayment