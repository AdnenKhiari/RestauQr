import Express from "express"
import { DecodeCookie } from "../../../utils/auth"
import * as admin from"firebase-admin"

const SignedIn = async (req: Express.Request,res: Express.Response,next: Express.NextFunction)=>{
    try{
        const auth = admin.auth()
        const decoded = await DecodeCookie(req,res)
        req.decodedtoken = decoded
        console.log("User: ",decoded)
        if(decoded)
            return next()
        else
            throw Error("Unauthorised")
    }catch(err){
        return next(err)
    }
}

export default {
    SignedIn
}