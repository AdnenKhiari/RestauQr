import { useState } from "react"
import {loadStripe} from "@stripe/stripe-js"
import {Elements,PaymentElement} from "@stripe/react-stripe-js"
import StripePayment from "./PaymentProviders/StripePayment"

const PaymentContainer  = ()=>{
    const [paymentMethod,setPaymentMethod] = useState("stripe")
    return <div className="payment-container">
        <div className="payment-method-container">
            <h1>Choose Payment Provider</h1>
            <p>You Can Pay In cash if you wish !</p>
            <div className="payment-methods">
            <div onClick={(e)=>setPaymentMethod("stripe")} className={"payment-method "+(paymentMethod === "stripe" ? "active" : "")}>
                <img src="/stripe.svg" alt="stripe " />
                <p>Stripe</p>
            </div>
            <div onClick={(e)=>setPaymentMethod("ctp")} className={"payment-method "+(paymentMethod === "ctp" ? "active" : "")}>
                <img src="/ctp.png" alt="click to pay " />
                <p>Click To Pay</p>
            </div>
            </div>
        </div>
        <div className="paymentform">
            {paymentMethod === "stripe" && <StripePayment />}
        </div>
    </div>
}

export default PaymentContainer