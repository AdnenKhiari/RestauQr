import e, { Router } from "express"
import * as admin from "firebase-admin"
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier"
import { clearCookie, DecodeCookie, IssueCookie, validateEmailOobCode, validatePasswordOobCode } from "../../../utils/auth"
import Users from "../../../DataAcessLayer/Users"
import OAuth from "../Authorisation"
import mailtransport from "../../../utils/transportmail"
import joi from "joi"
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
        return next(error)
    req.body = value
        return next()
},async (req,res,next)=>{
    try{
        const decoded = await DecodeCookie(req,res)
        req.decodedtoken = decoded
        if(decoded){
            req.user = await Users.GetUserByIdIfExists(decoded.uid)
            if(req.user)
                throw Error("Already Exists !")
            if(!decoded.email_verified){
                throw Error("Account Not Verified !")
            }
        }else{
            throw Error("Not Authorised")
        }
        return next()
    }catch(err){
        return next(err)
    }
},async (req,res,next)=>{
    const data = req.body
    const auth = admin.auth()
    console.log(data)
    try{
        const decodedtoken = req.decodedtoken
        data.permissions = {
            "food": {
                "manage": true
            },
            "categories": {
                "manage": true
            },
            "tables": {
                "manage": true
            },
            "orders": {
                "manage": true
            },
            "inventory": {
                "manage": true,
                "read": true
            },
            "users": {
                "manage": true,
                "read": true
            }
        }
        const id = await Users.AddUpdateUser(decodedtoken.uid,data)
        await auth.setCustomUserClaims(decodedtoken.uid,data.permissions)
        clearCookie(res)
        return res.send(id)
    }catch(err){
        return next(err)
    }
})

router.post('/signin',(req,res,next)=>{
    const {value,error} = tokenSchema.validate(req.body)
    if(error)
        return next(error)
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
        await IssueCookie(tokenid,res)
        return res.send("Ok")
    }catch(err){
        return next(err)
    }
})

router.post("/verifyPasswordCode",(req,res,next)=>{
    const {value,error} = schemaPasswordSchema.validate(req.body)
    if(error)
        return next(error)
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

router.post("/verifyEmailCode",OAuth.SignedIn,(req,res,next)=>{
    const {value,error} = validateOobcodeSchema.validate(req.body)
    if(error)
        return next(error)
    req.body = value
        return next()
},async (req,res,next)=>{
    try{
        const auth = admin.auth()
        const {oobCode}  = req.body
        const validation = await validateEmailOobCode(oobCode)
        await Users.VerifyUserById(req.decodedtoken.uid)
        clearCookie(res)
        return res.send("Ok")
    }catch(err){
        return next(err)
    }
})

router.post("/sendRecoverPassword",(req,res,next)=>{
    const {value,error} = validateEmailSchema.validate(req.body)
    if(error)
        return next(error)
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
        return next(error)
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