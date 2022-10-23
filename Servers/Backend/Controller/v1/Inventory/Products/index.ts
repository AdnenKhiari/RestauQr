import {Router} from "express"
import Inventory from "../../../../DataAcessLayer/Inventory"
import { Request } from "express"
import Merchandise from "./Merchandise"
import ProductTemplates from "./productTemplates"
import joi from "joi"
import OAuth from "../../Authorisation"
const router = Router()

const fetchMerchandisechema  = joi.object({
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
const fetchProductschema  = joi.object({
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

const consumeSchema = joi.object({
    used: joi.number().empty('').default(0).required(),
    wasted: joi.number().empty('').default(0).required()
})


const ProductSchema =joi.object({
    name: joi.string().required().label('Product Name'),
    sellingUnitPrice: joi.number().min(0).required().label('Price/U:'),
    unitQuantity: joi.number().min(0).required().label('Quantity/U'),
    customUnits: joi.array().items(joi.object({
        name: joi.string().required(),
        ratio: joi.number().required()
    }).optional()).label("Custom Units"),
    unit : joi.object({
        id: joi.string().optional(),
        name: joi.string().required().label("Unit Name"),
        subunit: joi.object({
            name: joi.string().required(),
            ratio: joi.number().required()
        }).optional()
    }).required()
})

router.get('/merchandise',OAuth.SignedIn,OAuth.HasAccess({inventory: "read"}),
(req,res,next)=>{

    const {value,error} = (fetchMerchandisechema.validate(req.query))
    if(error)
        return next(error)
    req.query = value
        return next()
},
async (req,res,next)=>{
    try{
        const search_params = req.query
        console.log(search_params)
        const data = await Inventory.Merchandise.GetMerchandise(search_params,undefined)
        return res.send({
            data: data
        })

    }catch(err){
        return next(err)
    }
})

router.get('/:id',OAuth.SignedIn,OAuth.HasAccess({inventory: "read"}),async (req,res,next)=>{
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
router.get('/',OAuth.SignedIn,OAuth.HasAccess({inventory: "read"}),
(req,res,next)=>{

    const {value,error} = (fetchProductschema.validate(req.query))
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

router.post('/',OAuth.SignedIn,OAuth.HasAccess({inventory: "manage"}),
(req,res,next)=>{

    const {value,error} = (ProductSchema.validate(req.body))
    if(error)
        return next(error)
    req.body = value
        return next()
},async (req,res,next)=>{
    const data = req.body
    try{
        const result = await Inventory.Products.AddUpdateProduct(data,undefined)
        return res.send({   
            data: {
                id: result
            }
        })
    }catch(err){
        return next(err)
    }
})
router.put('/:id',OAuth.SignedIn,OAuth.HasAccess({inventory: "manage"}),
(req,res,next)=>{

    const {value,error} = (ProductSchema.validate(req.body))
    if(error)
        return next(error)
    req.body = value
        return next()
},async (req,res,next)=>{
    const data = req.body
    const id = req.params.id
    try{
        const result = await Inventory.Products.AddUpdateProduct(data,id)
        return res.send({   
            data: {
                id: result
            }
        })
    }catch(err){
        return next(err)
    }
})
router.delete('/:id',OAuth.SignedIn,OAuth.HasAccess({inventory: "manage"}),async (req,res,next)=>{
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
router.post('/consume/:id',OAuth.SignedIn,OAuth.HasAccess({inventory: "manage"}),(req,res,next)=>{

    const {value,error} = (consumeSchema.validate(req.body))
    if(error)
        return next(error)
    req.body = value
        return next()
},async (req,res,next)=>{
    const {id} = req.params
    const data : {used:number,wasted:number} = req.body
    try{
        const result = await Inventory.Products.ConsumeProductItem(id,data)
        return res.send({
            data: result
        })
    }catch(err){
        return next(err)
    }
})

router.use('/:productid/merchandise',(req: Request,res,next)=>{
    req.productid = <string>req.params.productid
    return Merchandise(req,res,next)
})

router.use('/:productid/template',(req: Request,res,next)=>{
    req.productid = <string>req.params.productid
    return ProductTemplates(req,res,next)
})

router.get("/",(req,res)=>{
    return res.send("Hii Products")
})
export default router