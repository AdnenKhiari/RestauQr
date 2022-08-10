import {Router} from "express"
import Inventory from "../../../../DataAcessLayer/Inventory"
import { Request } from "express"
import ProductOrders from "./ProductOrders"
import joi from "joi"
const router = Router()

router.get('/product_orders',
(req,res,next)=>{
    const schema  = joi.object({
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
    const {value,error} = (schema.validate(req.query))
    if(error)
        return next(error)
    req.query = value
        return next()
},
async (req,res,next)=>{
    try{
        const search_params = req.query
        console.log(search_params)
        const data = await Inventory.ProductOrders.GetProductOrders(search_params,undefined)
        return res.send({
            data: data
        })

    }catch(err){
        return next(err)
    }
})

router.get('/:id',async (req,res,next)=>{
    const id: string = req.params.id
    try{
        const data = await Inventory.Products.GetProductById(id)
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
        highersellingUnitPrice: joi.number().allow('').optional().label("Price/U: min"),
        lowersellingUnitPrice: joi.number().allow('').optional().label("Price/U: max"),
    
        higherunitQuantity: joi.number().allow('').optional().label("Quantity/U: min"),
        lowerunitQuantity: joi.number().allow('').optional().label("Quantity/U: max"),
    
        higherstockQuantity: joi.number().allow('').optional().label("Available Stock: min"),
        lowerstockQuantity: joi.number().allow('').optional().label("Available Stock: max"),
    
        name: joi.string().allow('').optional().label("Product Name"),
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
    console.log(search_params)
    try{
        const data = await Inventory.Products.GetProducts(search_params || {})
        return res.send({
            data: data
        })
    }catch(err){
        return next(err)
    }
})

router.post('/',async (req,res,next)=>{
    const data = req.body
    try{
        const result = await Inventory.Products.AddUpdateProduct(data,undefined)
        return res.send({   
            data: result
        })
    }catch(err){
        return next(err)
    }
})
router.put('/:id',async (req,res,next)=>{
    const data = req.body
    const id = req.params.id
    try{
        const result = await Inventory.Products.AddUpdateProduct(data,id)
        return res.send({   
            data: result
        })
    }catch(err){
        return next(err)
    }
})
router.delete('/:id',async (req,res,next)=>{
    const {id} = req.params
    try{
        const data = await Inventory.Products.DeleteProduct(id)
        return res.send({
            data: data
        })

    }catch(err){
        return next(err)
    }
})

router.use('/:productid/product_orders',(req: Request,res,next)=>{
    req.productid = <string>req.params.productid
    return ProductOrders(req,res,next)
})


router.get("/",(req,res)=>{
    return res.send("Hii Products")
})
export default router