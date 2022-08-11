import {Router} from "express"
import Inventory from "../../../../../DataAcessLayer/Inventory"
import joi from "joi"
const router = Router()

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
    const schema  = joi.object({
        name: joi.string().allow('').optional().label("Item Name"),
        higherexpiresIn: joi.date().allow('').optional().label('Expires In : min'),
        lowerexpiresIn: joi.date().allow('').optional().label('Expires In : max'),
        highertime: joi.date().allow('').optional().label('Purshase Time : min'),
        lowertime: joi.date().allow('').optional().label('Purshase Time : max'),
        lastRef : joi.string().optional().label("Last Reference"),
        swapped: joi.boolean().optional().default(false).label("Swapped"),
        dir: joi.allow('desc','asc').default('desc').optional().label("Direction")
    })
    const {value,error} = (schema.validate(req.query))
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

router.post('/',async (req,res,next)=>{
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

router.put('/:subid',async (req,res,next)=>{
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
router.post('/consume/:subid',async (req,res,next)=>{
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