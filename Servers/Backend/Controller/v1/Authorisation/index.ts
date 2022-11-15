import Express from "express"
import { DecodeCookie, getLevel } from "../../../utils/auth"
import * as admin from"firebase-admin"

interface permissions  {
    [index: string]: string | undefined;
    users?:"manage" | "read" | "none";
    tables?:"manage" | "read";
    inventory?:"manage" | "read"|  "none";
    food?:"manage" | "read";
    orders?:"manage" | "read";
    categories?:"manage" | "read";

}

const SignedIn = async (req: Express.Request,res: Express.Response,next: Express.NextFunction)=>{
    try{
        const auth = admin.auth()
        const decoded = await DecodeCookie(req,res)
        req.decodedtoken = decoded
        //console.log("User: ",decoded)
        if(decoded)
            return next()
        else
            throw Error("Unauthorised")
    }catch(err){
        return next(err)
    }
}
const HasAccess = (scopes : permissions) => (req : Express.Request,res : Express.Response,next : Express.NextFunction)=>{
    console.warn("DECOED IN SCOPE",req.decodedtoken)
    Object.keys(scopes).forEach((scope: string)=>{
        console.log("FOUND",scope,req.decodedtoken)

        const result : string = req.decodedtoken[scope]
        if(!result || getLevel(result)  <  getLevel(<string>scopes[scope])){
            return next("Unauthorised 403")
        }
    })
    return next()
}

export default {
    SignedIn,
    HasAccess
} 