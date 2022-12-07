import {Router} from "express"
import Inventory from "../../../../../DataAcessLayer/Inventory"
import joi, { optional } from "joi"
import OAuth from "../../../Authorisation"

const router = Router()

const fetchMerchandiseSchema  = joi.object({
    name: joi.string().allow('').optional().label("Item Name"),
    higherexpiresIn: joi.date().allow('').optional().label('Expires In : min'),
    lowerexpiresIn: joi.date().allow('').optional().label('Expires In : max'),
    highertime: joi.date().allow('').optional().label('Purshase Time : min'),
    lowertime: joi.date().allow('').optional().label('Purshase Time : max'),
    lastRef : joi.string().optional().label("Last Reference"),
    lastProductRef : joi.string().optional().label("Last Product Reference"),
    swapped: joi.boolean().optional().default(false).label("Swapped"),
    dir: joi.allow('desc','asc').default('desc').optional().label("Direction")
})
const consumeSchema = joi.object({
    used: joi.number().empty('').default(0).required(),
    wasted: joi.number().empty('').default(0).required(),
    updateGlobally: joi.boolean().default(false).required()
})


router.get('/:subid',OAuth.SignedIn,OAuth.HasAccess({inventory: "read"}),async (req,res,next)=>{
    const subid: string = req.params.subid
    const productid: string = <string>req.productid
    try{
        const data = await Inventory.Merchandise.GetMerchandiseById(productid,subid)
        return res.send({
            data: data
        })
    }catch(err){
        return next(err)
    }
})
router.get('/',OAuth.SignedIn,OAuth.HasAccess({inventory: "read"}),
(req,res,next)=>{

    const {value,error} = (fetchMerchandiseSchema.validate(req.query))
    if(error)
        return next(error)
    req.query = value
        return next()
}
,async (req,res,next)=>{
    const search_params = req.query
    const productid: string = <string>req.productid
    console.log(search_params)
    try{
        const data = await Inventory.Merchandise.GetMerchandise(search_params || {},productid)
        return res.send({
            data: data
        })
    }catch(err){
        return next(err)
    }
})

router.post('/',OAuth.SignedIn,OAuth.HasAccess({inventory: "manage"}),async (req,res,next)=>{
    const data = req.body
    const productid: string = <string>req.productid
    try{
        const result = await Inventory.Merchandise.AddUpdateMerchandise(productid,undefined,data)
        return res.send({
            data: result
        })
    }catch(err){
        return next(err)
    }
})

router.put('/:subid',OAuth.SignedIn,OAuth.HasAccess({inventory: "manage"}),async (req,res,next)=>{
    const data = req.body
    const productid: string = <string>req.productid
    const subid = req.params.subid
    try{
        const result = await Inventory.Merchandise.AddUpdateMerchandise(productid,subid,data)
        return res.send({
            data: result
        })
    }catch(err){
        return next(err)
    }
})
router.post('/consume/:subid',OAuth.SignedIn,OAuth.HasAccess({inventory: "manage"}),
(req,res,next)=>{

    const {value,error} = (consumeSchema.validate(req.body))
    if(error)
        return next(error)
    req.body = value
        return next()
},async (req,res,next)=>{
    const {subid} = req.params
    const productid: string = <string>req.productid

    const data : {used:number,wasted:number,updateGlobally : boolean} = req.body
    try{
        const result = await Inventory.Merchandise.ConsumeMerchandise(productid,subid,data)
        return res.send({
            data: result
        })

    }catch(err){
        return next(err)
    }
})
router.delete('/:id',OAuth.SignedIn,OAuth.HasAccess({inventory: "manage"}),async (req,res,next)=>{
    const {id} = req.params
    const productid: string = <string>req.productid

    try{
        const data = await Inventory.Merchandise.DeleteMerchandise(productid,id)
        return res.send({
            data: {
                toremove: data
            }
        })

    }catch(err){
        return next(err)
    }
})
    
router.get("/",(req,res)=>{
    return res.send("Hii Merchandise")
})
export default router