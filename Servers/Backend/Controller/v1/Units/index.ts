import {Router} from "express"
import  Tables from "../../../DataAcessLayer/Tables"
import joi from "joi"
import OAuth from "../Authorisation"
import Units from "../../../DataAcessLayer/Units"

const router = Router()

const subunit = joi.object({
    name: joi.string().required().label("Sub Unit Name"),
    ratio: joi.number().required().positive().label("Ratio")
})
const units = joi.object({
    name : joi.string().required().label("Unit Name"),
    subunits: joi.array().items(subunit).required()
})

const unitsSchema = joi.object({
    allunits: joi.array().items(units).required()
})
router.get('/',async (req,res,next)=>{
    try{
        const data = await Units.GetUnits()
        return res.send({
            data: data
        })
    }catch(err){
        return next(err)
    }
})
router.put('/',OAuth.SignedIn,OAuth.HasAccess({food: "manage"}),
(req,res,next)=>{
    const {value,error} = unitsSchema.validate(req.body)
    if(error)
        return next(error)
    req.body = value
        return next()
},
async (req,res,next)=>{
    const data = req.body
    try{
        const result = await Units.AddUpdateUnits(data)
        return res.send({
            data: "Ok"
        })
    }catch(err){
        return next(err)
    }
})


router.get("/",(req,res)=>{
    return res.send("Hii Units")
})
export default router