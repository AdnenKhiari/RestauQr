import Express from "express"
import { DecodeCookie, getLevel } from "../../../utils/auth"
import * as admin from"firebase-admin"
import { StatusCodes } from "http-status-codes";
import { HTTPError } from "../../../lib/Error";

interface permissions  {
    [index: string]: string | undefined;
    users?:"manage" | "read" | "none";
    tables?:"manage" | "read";
    inventory?:"manage" | "read"|  "none";
    food?:"manage" | "read";
    orders?:"manage" | "read";
    categories?:"manage" | "read";
    suppliers?:"manage" | "read" |  "none";
    product_orders?:"manage" | "read" |  "none";
    units?: "manage" | "read";

}

const SignedIn = async (req: Express.Request,res: Express.Response,next: Express.NextFunction)=>{
    try{
        const decoded = await DecodeCookie(req,res)
        req.decodedtoken = decoded
        if(decoded)
            return next()
        else
            throw new HTTPError("Need to Sign In First",undefined,StatusCodes.UNAUTHORIZED)
    }catch(err){
        return next(err)
    }
}
const HasAccess = (scopes : permissions) => (req : Express.Request,res : Express.Response,next : Express.NextFunction)=>{
    //console.warn("DECOED IN SCOPE",req.decodedtoken)
    const current_permissions = req.decodedtoken?.permissions
    Object.keys(scopes).forEach((scope: string)=>{
        console.log("FOUND",scope,req.decodedtoken)

        const result : string = current_permissions[scope]
        if(!result || getLevel(result)  <  getLevel(<string>scopes[scope])){
            return next(
                new HTTPError("Need higher privileges",undefined,StatusCodes.FORBIDDEN)
            )
        }
    })
    return next()
}

export default {
    SignedIn,
    HasAccess
} 