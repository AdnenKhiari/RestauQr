import {Router} from "express"
import Suppliers from "../../../DataAcessLayer/Suppliers"
import ProductOrders from "./ProductOrders"
import { Request } from "express"
import ProductOrdersDAL from "../../../DataAcessLayer/Suppliers/ProductOrders"

import Basejoi from "joi"
import {fileListExtension} from "joi-filelist"
import OAuth from "../Authorisation"
import { ValidationError } from "../../../lib/Error"
const router = Router()
const joi =  fileListExtension(Basejoi)


const fetchSuppliersSchema  = joi.object({
    address: joi.number().allow('').optional().label("Address"),
    phoneNumber: joi.number().allow('').optional().label("Phone Number"),
    name: joi.string().allow('').optional().label("Supplier Name")
})


const SuppliersSchema =joi.object({
    name: joi.string().required().label('Name'),
    logo: joi.string().uri().allow("").required().label("Logo"),
    email: joi.string().email({tlds: {allow: false}}).required().label('Email'),
    website:  joi.string().allow("").uri().optional().label('Website'),
    addresses: joi.array().items(joi.string().required()).required().label("Addresses"),
    phonenumbers: joi.array().items(joi.string().regex(new RegExp(/^\+[1-9]\d{1,14}$/)).required()).required().label("Phone Numbers"),
    products: joi.array().items(joi.object({
        id: joi.string().required(),
        name: joi.string().required()
    })).required()
})
router.get('/product_orders',/*(req,res,next)=>{

    const {value,error} = (fetchSuppliersSchema.validate(req.query))
    if(error)
        return next(new ValidationError(error.message,error.details,error.stack))
    req.query = value
        return next()
}
,*/async (req,res,next)=>{
    const search_params : any = req.query
    console.log("jetni el request ",search_params)
    try{
        const data = await ProductOrdersDAL.GetProductOrders(search_params || {},undefined)
        return res.send({
            data: data
        })
    }catch(err){
        return next(err)
    }
})

router.get('/:id',OAuth.SignedIn,OAuth.HasAccess({food:"read"}),async (req,res,next)=>{
    const id: string = req.params.id
    try{
        const data = await Suppliers.GetSupplierById(id)
        return res.send({
            data: data
        })
    }catch(err){
        return next(err)
    }
})
router.get('/',(req,res,next)=>{

    const {value,error} = (fetchSuppliersSchema.validate(req.query))
    if(error)
    return next(new ValidationError(error.message,error.details,error.stack))
    req.query = value
        return next()
}
,async (req,res,next)=>{
    const search_params = req.query
    console.log(search_params)
    try{
        const data = await Suppliers.GetSuppliers(search_params || {})
        return res.send({
            data: data
        })
    }catch(err){
        return next(err)
    }
})
router.post('/',OAuth.SignedIn,OAuth.HasAccess({food:"manage"}),
(req,res,next)=>{
    const {value,error} = (SuppliersSchema.validate(req.body))
    if(error)
    return next(new ValidationError(error.message,error.details,error.stack))
    req.body = value
        return next()
}
,async (req,res,next)=>{
    const data : any= req.body
    try{
        const result = await Suppliers.AddUpdateSupplier(data,undefined)
        return res.send({
            data:  {
                id: result
            }
        })
    }catch(err){
        return next(err)
    }
})
router.put('/:id',OAuth.SignedIn,OAuth.HasAccess({food:"manage"}),
(req,res,next)=>{
    const {value,error} = (SuppliersSchema.validate(req.body))
    if(error)
    return next(new ValidationError(error.message,error.details,error.stack))
    req.body = value
        return next()
},
async (req,res,next)=>{
    const data : any = req.body
    const {id} = req.params
    try{
        const result = await Suppliers.AddUpdateSupplier(data,id)
        return res.send({
            data: {
                id: result
            }
        })
    }catch(err){
        return next(err)
    }
})
router.delete('/:id',OAuth.SignedIn,OAuth.HasAccess({food:"manage"}),async (req,res,next)=>{
    const {id} = req.params
    try{
        const data = await Suppliers.DeleteSupplierById(id)
        return res.send({
            data: data
        })

    }catch(err){
        return next(err)
    }
})



router.use("/:supplierid/product_orders",async (req : Request,res,next)=>{
    req.supplierid = req.params.supplierid
    return ProductOrders(req,res,next)
})


export default router