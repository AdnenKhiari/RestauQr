import {Router} from "express"
import ProductOrders from "../../../../DataAcessLayer/Suppliers/ProductOrders"
import { Request } from "express"
import BaseJoi from "joi"
import OAuth from "../../Authorisation"
import { fileListExtension } from "joi-filelist"
import { ValidationError } from "../../../../lib/Error"

const router = Router()

const joi  =  fileListExtension(BaseJoi)  
const orderdetailschema = joi.object({
    status: joi.string().valid("Completed","Canceled","Waiting").required().label('Status'),
    delivery_date: joi.date().allow("").required().label('Delivery Date'),
    cancel_reason: joi.string().allow("").label("Cancel Reason").optional(),
})
const schema = joi.object({
    expected_delivery_date: joi.date().required().label('Expected Date'),
    notes: joi.string().allow("").label("Notes"),
    orders: joi.array().items(joi.object({
        id: joi.string().allow("").optional(),
        productorder_details: joi.any(),
        product: joi.string().required(),
        details: orderdetailschema.optional()
    })).required()
})

router.post('/',OAuth.SignedIn,OAuth.HasAccess({inventory:"manage"}),
(req,res,next)=>{
    const {value,error} = (schema.validate(req.body))
    if(error)
    return next(new ValidationError(error.message,error.details,error.stack))
    req.body = value
        return next()
},async (req,res,next)=>{
    try{
        const supplierid: string = <string>req.supplierid
        const data = req.body
        const result = await ProductOrders.AddUpdateProductOrder(data,supplierid,undefined)
        return res.json({data: {id: result}})
    }catch(err){
        return next(err)
    }
})
router.put('/:id',OAuth.SignedIn,OAuth.HasAccess({inventory:"manage"}),
(req,res,next)=>{
    const {value,error} = (schema.validate(req.body))
    if(error)
    return next(new ValidationError(error.message,error.details,error.stack))
    req.body = value
        return next()
},async (req,res,next)=>{
    try{
        const supplierid = <string>req.supplierid
        const id = req.params.id
        const data = req.body
        const result = await ProductOrders.AddUpdateProductOrder(data,supplierid,id)
        return res.json({data: {id: result}})
    }catch(err){
        return next(err)
    }
})

router.get('/:id',OAuth.SignedIn,OAuth.HasAccess({inventory:"read"}),async (req,res,next)=>{
    const id: string = req.params.id
    const supplierid = <string>req.supplierid
    try{
        const data = await ProductOrders.GetProductOrderById(supplierid,id)
        return res.send({
            data: data
        })
    }catch(err){
        return next(err)
    }
})

router.get('/',OAuth.SignedIn,OAuth.HasAccess({inventory:"read"}),
/*(req,res,next)=>{

    const {value,error} = (fetchOrdersSchema.validate(req.query))
    if(error)
        return next(new ValidationError(error.message,error.details,error.stack))
    req.query = value
        return next()
}
,*/async (req,res,next)=>{
    const search_params = req.query
    console.log(search_params)
    try{
        const data = await ProductOrders.GetProductOrders(search_params || {},req.supplierid)
        return res.send({
            data: data
        })
    }catch(err){
        return next(err)
    }
})

router.delete('/:id',OAuth.SignedIn,OAuth.HasAccess({inventory: "manage"}),async (req,res,next)=>{
    const id: string = req.params.id
    const supplierid = <string>req.supplierid
    try{
        const data = await ProductOrders.DeleteProductOrder(supplierid,id)
        return res.send({
            data: data
        })

    }catch(err){
        return next(err)
    }
})

router.get("/",(req,res)=>{
    return res.send("Hii Orders")
})
export default router