import  { Router } from "express"
import Users from "../../../DataAcessLayer/Users"
import OAuth from "../Authorisation"
import * as admin from "firebase-admin"
import { clearCookie } from "../../../utils/auth"
import joi from "joi"
import { AddTokenToTable } from "../../../DataAcessLayer/PushNotification"
const router = Router()

const pushSchema  = joi.object({
    token: joi.string().required()
})


router.put('/:orderid',(req,res,next)=>{
    const {value,error} = pushSchema.validate(req.body)
    if(error)
        return next(error)
    req.body = value
        return next()
},async (req,res,next)=>{
    try{
        const {token} = req.body
        const {orderid} = req.params
        const data = await AddTokenToTable(token,orderid)
        return res.json("Ok")
    }catch(err){
        return next(err)
    }
})


router.get("/",(req,res)=>res.send("Hii Push"))
export default router