import bodyParser from "body-parser"
import Express from "express"
import Stripe from "stripe"
import LoadEnv from "../../../../utils/Loadenv"
import { ConfirmPayment } from "../../../../utils/Payments"
const router = Express.Router()

LoadEnv()

const stripe_key = <string>(process.env.STRIPE_KEY)
const stripe = new Stripe(stripe_key, {
    apiVersion: '2022-08-01',
});
router.get("/clientsecret",async (req,res,next)=>{
  try{
    const intent = await stripe.paymentIntents.create({
      amount: 765,
      currency: "eur",
      description: "payment desc lel",
      automatic_payment_methods: {
        enabled: true
      }
    })
    return res.json({
      data : {client_secret: intent.client_secret}
    })
  }catch(err){
    return next(err)
  }

})


router.post("/webhooks",bodyParser.raw({type: "*/*"}),(req,res,next)=>{
  //verify event is coming from stripe
  try{
    //need to verify status code response in error
    const sig : any= req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(<Buffer>req.rawBody,sig,<string>process.env.STRIPE_WEBHOOK_SECRET)
    req.body = event
    return next()
  }catch(err){
    return next(err)
  }
},(req,res)=>{
  const event = req.body
  const data =   event && event.data ? event.data.object : undefined;
  //console.log("Stripe Event Made It",event)
  console.log("Stripe Event Made It")
  switch(event.type){
    case 'payment_intent.succeeded':
      //addStripePaymentToPayments()
      //ConfirmPayment()
      console.log("Succeded",data)
    break;
    case 'payment_intent.canceled':
      //addStripePaymentToPayments()
      //ConfirmPayment()
      console.log("canceled",data)
    break;
    case 'payment_intent.payment_failed':
      //addStripePaymentToPayments()
      //ConfirmPayment()
      console.log("payment_failed",data)
    break;
    case 'payment_intent.processing':
      //addStripePaymentToPayments()
      //ConfirmPayment()
      console.log("prcoessing",data)
    break;
    default:
      console.log(event.type," Not Taken Into Account")
    break;
  }
  return res.status(200).send("Valid")
})

export default router