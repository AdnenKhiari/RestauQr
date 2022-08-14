import {Router} from "express"
import Inventory from "../../../../../DataAcessLayer/Inventory"
import joi from "joi"
const router = Router()

const fetchProductOrdersSchema  = joi.object({
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
    updateGlobally: joi.number().empty('').default(0).required()
})

const productOrderSchema = joi.object({
    name: joi.string().required().label('Item Name'),
    productQuantity: joi.number().min(0).required().label('Item Quantity :'),
    unitQuantity: joi.number().min(0).required().label('Quantity/U'),
    unitPrice: joi.number().min(0).required().label('Price/U'),
    time: joi.date().required().label('Time'),
    expiresIn: joi.date().required().label('Expires In')
})
router.get('/:subid',async (req,res,next)=>{
    const subid: string = req.params.subid
    const productid: string = <string>req.productid
    try{
        const data = await Inventory.ProductOrders.GetProductOrderById(productid,subid)
        return res.send({
            data: data
        })
    }catch(err){
        return next(err)
    }
})
router.get('/',
(req,res,next)=>{

    const {value,error} = (fetchProductOrdersSchema.validate(req.query))
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
        const data = await Inventory.ProductOrders.GetProductOrders(search_params || {},productid)
        return res.send({
            data: data
        })
    }catch(err){
        return next(err)
    }
})

router.post('/',
(req,res,next)=>{

    const {value,error} = (productOrderSchema.validate(req.body))
    if(error)
        return next(error)
    req.body = value
        return next()
},async (req,res,next)=>{
    const data = req.body
    const productid: string = <string>req.productid
    try{
        const result = await Inventory.ProductOrders.AddUpdateProductOrders(productid,undefined,data)
        return res.send({
            data: result
        })
    }catch(err){
        return next(err)
    }
})

router.put('/:subid',
(req,res,next)=>{

    const {value,error} = (productOrderSchema.validate(req.body))
    if(error)
        return next(error)
    req.body = value
        return next()
},async (req,res,next)=>{
    const data = req.body
    const productid: string = <string>req.productid
    const subid = req.params.subid
    try{
        const result = await Inventory.ProductOrders.AddUpdateProductOrders(productid,subid,data)
        return res.send({
            data: result
        })
    }catch(err){
        return next(err)
    }
})
router.post('/consume/:subid',
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
        const result = await Inventory.ProductOrders.ConsumeProductOrder(productid,subid,data)
        return res.send({
            data: result
        })

    }catch(err){
        return next(err)
    }
})
router.delete('/:id',async (req,res,next)=>{
    const {id} = req.params
    const productid: string = <string>req.productid

    try{
        const data = await Inventory.ProductOrders.DeleteProductOrder(productid,id)
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
    return res.send("Hii Products")
})
export default router