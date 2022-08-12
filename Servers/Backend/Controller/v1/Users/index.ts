import  { Router } from "express"
import Users from "../../../DataAcessLayer/Users"
import OAuth from "../Authorisation"
const router = Router()


router.get('/current',OAuth.SignedIn,async (req,res,next)=>{
    try{
        return res.redirect( req.decodedtoken.uid)
    }catch(err){
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
        console.log("Im here")
        const id: string = req.params.id
        console.log("IDD",id)
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
        if(body.email){
            await Users.UpdateEmail(id,body.email)
            body.email = undefined
        }
        if(body.password){
            await Users.UpdatePassword(id,body.password)
            body.password = undefined
        }
        await Users.UpdateUserInfo(id,{permissions: body.permissions,name: body.name})

        return res.json("Ok")
    }catch(err){
        return next(err)
    }
})


router.get("/",(req,res)=>res.send("Hii users"))
export default router