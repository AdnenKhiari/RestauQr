import  { Router } from "express"
import Users from "../../../DataAcessLayer/Users"
import OAuth from "../Authorisation"
import * as admin from "firebase-admin"
import { clearCookie, updateClaims } from "../../../utils/auth"
import joi from "joi"
import { ValidationError } from "../../../lib/Error"
const router = Router()

const userUpdateSchema  = joi.object({
    email: joi.string().allow("").optional(),
    password: joi.string().allow("").optional(),
    name: joi.string().required(),
    permissions: joi.object({
        users: joi.allow('manage','read','none'),
        tables: joi.allow('manage','read'),
        inventory: joi.allow('manage','read','none'),
        food: joi.allow('manage','read'),
        orders: joi.allow('manage','read'),
        categories: joi.allow('manage','read'),
        suppliers: joi.allow('manage','read','none'),
        units: joi.allow('manage','read'),
    }).required()
})

router.get('/current',OAuth.SignedIn,async (req,res,next)=>{
    try{
        const data = await Users.GetUserByIdIfExists(req.decodedtoken.uid)
        if(!data)
            return res.json({
                data: {
                    emailVerified: req.decodedtoken.email_verified,
                    email: req.decodedtoken.email,
                    id: req.decodedtoken.uid
                }
            })
        else{
            return res.json({
                data: {
                    id: req.decodedtoken.uid,
                    emailVerified: req.decodedtoken.email_verified,
                    email: req.decodedtoken.email,
                    profile: data
                }
            })       
        }
    }catch(err : any){
        return next(err)
    }
})

router.get('/',OAuth.SignedIn,OAuth.HasAccess({users: "read"}),async (req,res,next)=>{
    try{
        const data = await Users.GetAllUsers()
        return res.json({
            data: data
        })
    }catch(err){
        return next(err)
    }
})

router.get('/:id',OAuth.SignedIn,OAuth.HasAccess({users: "read"}),async (req,res,next)=>{
    try{
        const id: string = req.params.id
        const data = await Users.GetUserById(id)
        return res.json({
            data: data
        })
    }catch(err){
        return next(err)
    }
})


router.delete('/:id',OAuth.SignedIn,OAuth.HasAccess({users: "manage"}),async (req,res,next)=>{
    try{
        const id: string = req.params.id
        const data = await Users.RemoveUser(id)
        return res.json("Ok")
    }catch(err){
        return next(err)
    }
})

router.put('/:id',OAuth.SignedIn,OAuth.HasAccess({users: "manage"}),(req,res,next)=>{
    const {value,error} = userUpdateSchema.validate(req.body)
    if(error)
    return next(new ValidationError(error.message,error.details,error.stack))
    req.body = value
        return next()
},async (req,res,next)=>{
    try{
        const {id} = req.params
        const body = req.body

        if(body.email){
            await Users.UpdateEmail(id,body.email)
            body.email = undefined
        }
        if(body.password){
            await Users.UpdatePassword(id,body.password)
            body.password = undefined
        }
        await Users.UpdateUserInfo(id,{permissions: body.permissions,name: body.name})

        if(body.permissions){
            updateClaims(id,{
                permissions: body.permissions
            })
            clearCookie(res)
        }

        return res.json("Ok")
    }catch(err){
        return next(err)
    }
})


router.get("/",(req,res)=>res.send("Hii users"))
export default router