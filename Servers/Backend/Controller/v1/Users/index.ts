import  { Router } from "express"
import Users from "../../../DataAcessLayer/Users"
import OAuth from "../Authorisation"
import * as admin from "firebase-admin"
import { clearCookie } from "../../../utils/auth"
const router = Router()


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

router.get('/',async (req,res,next)=>{
    try{
        const data = await Users.GetAllUsers()
        return res.json({
            data: data
        })
    }catch(err){
        return next(err)
    }
})

router.get('/:id',async (req,res,next)=>{
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


router.delete('/:id',async (req,res,next)=>{
    try{
        const id: string = req.params.id
        const data = await Users.RemoveUser(id)
        return res.json("Ok")
    }catch(err){
        return next(err)
    }
})

router.put('/:id',async (req,res,next)=>{
    try{
        const {id} = req.params
        const body = req.body
        const auth = admin
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
            await admin.auth().setCustomUserClaims(id,body.permissions)
            clearCookie(res)
        }

        return res.json("Ok")
    }catch(err){
        return next(err)
    }
})


router.get("/",(req,res)=>res.send("Hii users"))
export default router