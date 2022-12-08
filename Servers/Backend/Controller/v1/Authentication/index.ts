import e, { Router } from "express"
import * as admin from "firebase-admin"
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier"
import { clearCookie, DecodeCookie, IssueCookie, updateClaims, validateEmailOobCode, validatePasswordOobCode } from "../../../utils/auth"
import Users from "../../../DataAcessLayer/Users"
import OAuth from "../Authorisation"
import mailtransport from "../../../utils/transportmail"
import joi from "joi"
import {
	ReasonPhrases,
	StatusCodes,
	getReasonPhrase,
	getStatusCode,
} from 'http-status-codes';
import { HTTPError, ValidationError } from "../../../lib/Error"

const router = Router()

const schemaPasswordSchema  = joi.object({
    oobCode: joi.string().required(),
    newPassword: joi.string().required()
})
const validateOobcodeSchema  = joi.object({
    oobCode: joi.string().required()
})
const createProfileSchema  = joi.object({
    name: joi.string().required()
})
const validateEmailSchema  = joi.object({
    email: joi.string().required()
})
const tokenSchema = joi.object({
    tokenid: joi.string().label("token id")
})
router.post('/createProfile',OAuth.SignedIn,(req,res,next)=>{
    const {value,error} = createProfileSchema.validate(req.body)
    if(error)
        return next(new ValidationError(error.message,error.details,error.stack))
    req.body = value
        return next()
},async (req,res,next)=>{
    try{
        const decoded = await DecodeCookie(req,res)
        req.decodedtoken = decoded
        if(decoded){
            req.user = await Users.GetUserByIdIfExists(decoded.uid)
            if(req.user)
                throw new HTTPError("Session Already Exists",undefined,StatusCodes.BAD_REQUEST)
            if(!decoded.email_verified){
                throw new HTTPError("Account Not Verified",undefined,StatusCodes.BAD_REQUEST)
            }
        }else{
            return res.redirect("/auth/signin")
        }
        return next()
    }catch(err){
        return next(err)
    }
},async (req,res,next)=>{
    const data : any = req.body
    const auth = admin.auth()
    console.log(data)
    try{
        const decodedtoken : any = req.decodedtoken
        data.permissions = {
            "food":"read",
            "categories":"read",
            "tables":"read",
            "orders":"read",
            "inventory":"none",
            "users": "none",
            "suppliers": "none",
            "units": "none"
        }
        const id = await Users.AddUpdateUser(decodedtoken.uid,data)
        await updateClaims(id,{
            permissions: data.permissions
        })
        clearCookie(res)
        return res.send(id)
    }catch(err){
        return next(err)
    }
})

router.post('/signin',(req,res,next)=>{
    const {value,error} = tokenSchema.validate(req.body)
    if(error)
    return next(new ValidationError(error.message,error.details,error.stack))
    req.body = value
        return next()
},
async (req,res,next)=>{
    try{
        const decoded = await DecodeCookie(req,res)
        if(decoded)
            return res.send("Ok Exists")
        else
            return next()
    }catch(err){
        return next(err)
    }
},
async (req,res,next)=>{
    const {tokenid} = req.body
    const auth = admin.auth()
    try{
        const decodedtoken = await auth.verifyIdToken(tokenid)
        //validate user state otheriwse revoke token and refuse the login
        const user = await Users.GetUserById(decodedtoken.uid)
        const user_permissions = user.profile?.permissions
        if(Object.keys(user_permissions).some((key)=>{
            return (!decodedtoken.permissions[key] || decodedtoken.permissions[key] !== user_permissions[key])
        })){
            await updateClaims(decodedtoken.uid,{
                permissions: user_permissions
            })
            //throw Error("User Data Not Coherent with session information")
            clearCookie(res)
            return res.redirect("../logout")
        }
        await IssueCookie(tokenid,res)
        return res.send("Ok")
    }catch(err){
        return next(err)
    }
})

router.post("/verifyPasswordCode",(req,res,next)=>{
    const {value,error} = schemaPasswordSchema.validate(req.body)
    if(error)
    return next(new ValidationError(error.message,error.details,error.stack))
    req.body = value
        return next()
},async (req,res,next)=>{
    try{
        const auth = admin.auth()
        const {oobCode,newPassword}  = req.body
        const validation = await  validatePasswordOobCode(oobCode,newPassword)
        return res.send(validation)
    }catch(err){
        return next(err)
    }
})

router.post("/verifyEmailCode",(req,res,next)=>{
    const {value,error} = validateOobcodeSchema.validate(req.body)
    if(error)
    return next(new ValidationError(error.message,error.details,error.stack))
    req.body = value
        return next()
},async (req,res,next)=>{
    try{
        const auth = admin.auth()
        const {oobCode}  = req.body
        console.log(req.decodedtoken)
        const validation = await validateEmailOobCode(oobCode)
        await Users.VerifyUserById(req.decodedtoken.uid)
        clearCookie(res)
        return res.send("Ok")
    }catch(err){
        return next(err)
    }
})

router.post("/sendRecoverPassword",(req,res,next)=>{
    console.log(req.body,"RESET PASSWORD")
    const {value,error} = validateEmailSchema.validate(req.body)
    if(error)
    return next(new ValidationError(error.message,error.details,error.stack))
    req.body = value
        return next()
},async (req,res,next)=>{
    try{
        const {email}  = req.body
        const auth = admin.auth()
        console.log(req.body)

        const link = await auth.generatePasswordResetLink(email)
        const mail = await mailtransport.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>',
            to: email,
            subject: "Recover Password Mail",
            text: `
                Forgot your password ?
                <b>${link}<b/>
            `
        })
        console.log(mail)
        return res.send(link)
    }catch(err){
        return next(err)
    }
})

router.post("/sendValidateEmail",OAuth.SignedIn,(req,res,next)=>{
    const {value,error} = validateEmailSchema.validate(req.body)
    if(error)
    return next(new ValidationError(error.message,error.details,error.stack))
    req.body = value
        return next()
},async (req,res,next)=>{
    try{
        const {email}  = req.body
        const auth = admin.auth()
        console.log(email)
        const link = await auth.generateEmailVerificationLink(email)
        const mail = await mailtransport.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>',
            to: "bar@example.com, baz@example.com",
            subject: "Validate Account",
            text: `
                Validate your account !!
                <b>${link}<b/>
            `
        })
        console.log(mail)        
        return res.send(link)
    }catch(err){
        return next(err)
    }
})

router.get("/logout",OAuth.SignedIn,async (req,res,next)=>{
    try{
        console.log("You SIgned Out")
        const auth = admin.auth()
        await auth.revokeRefreshTokens(req.decodedtoken.uid)
        clearCookie(res)
        return res.send("Ok")
    }catch(err){
        return next(err)
    }
})


router.get("/",(req,res)=>res.send("Hii Auth"))
export default router