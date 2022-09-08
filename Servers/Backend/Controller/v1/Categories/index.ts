import {Router} from "express"
import  Tables from "../../../DataAcessLayer/Tables"
import joi from "joi"
import OAuth from "../Authorisation"
import Categories from "../../../DataAcessLayer/Categories"

const router = Router()

const catsSchema = joi.object({
    categories: joi.array().items(joi.string()).required()
})
router.get('/',async (req,res,next)=>{
    try{
        const data = await Categories.GetCategories()
        return res.send({
            data: data
        })
    }catch(err){
        return next(err)
    }
})
router.put('/',OAuth.SignedIn,OAuth.HasAccess({categories: "manage"}),
(req,res,next)=>{
    const {value,error} = catsSchema.validate(req.body)
    if(error)
        return next(error)
    req.body = value
        return next()
},
async (req,res,next)=>{
    const data = req.body
    try{
        const result = await Categories.AddUpdateCategories(data)
        return res.send({
            data: "Ok"
        })
    }catch(err){
        return next(err)
    }
})


router.get("/",(req,res)=>{
    return res.send("Hii Categories")
})
export default router