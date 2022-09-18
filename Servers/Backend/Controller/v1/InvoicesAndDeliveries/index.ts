/*
Infos:
Events:
Products was validated at kdhe wkdhe 
Product kdhe wkdhe was accepted at 

Name,Product,Units,Quantity per unit , (total quantity ) , (total price Tax included) , (price per unit Tax included),delivery Date

Delivery Note
Name | Product Name | total quantity | total price | from waiting to ( received , canceled ) | quality: 1-10
if( received is chosen , create a product order and link it with it )
*/

import {Router} from "express"
import InvoicesAndDeliveries from "../../../DataAcessLayer/InvoicesAndDeliveries"
import { Request } from "express"
import joi from "joi"
import OAuth from "../Authorisation"

const router = Router()
/*
const fetchOrdersSchema  = joi.object({
    tableid: joi.number().allow('').optional().label("Table Id"),
    startDate: joi.date().allow('').optional().label('Start Order Date'),
    endDate: joi.date().allow('').optional().label('End Order Date'),
    lastRef : joi.string().optional().label("Last Reference"),
    swapped: joi.boolean().optional().default(false).label("Swapped"),
    dir: joi.allow('desc','asc').default('desc').optional().label("Direction")
})
const fetchSubOrdersSchema  = joi.object({
    tableid: joi.string().allow('').optional().label("Table Id"),
    startDate: joi.date().allow('').optional().label('Start Order Date'),
    endDate: joi.date().allow('').optional().label('End Order Date'),
    lastRef : joi.string().optional().label("Last Reference"),
    status: joi.string().optional().label("Status"),
    lastOrderRef : joi.string().optional().label("Last Order Reference"),
    order_ref: joi.string().optional(),
    swapped: joi.boolean().optional().default(false).label("Swapped"),
    dir: joi.allow('desc','asc').default('desc').optional().label("Direction")
})
const orderSchema = joi.object({
    status: joi.string().allow("paid","unpaid")
})

router.post('/',async (req,res,next)=>{
    try{
        const {order,cartitem} = req.body
        await Orders.AddUpdateClientSubOrder(order,cartitem)
        return res.json({
            data: {
                order: order,
                cartitem: cartitem
            }
        })
    }catch(err){
        return next(err)
    }
})
router.put('/:id',async (req,res,next)=>{
    try{
        const {order,cartitem} = req.body
        await Orders.AddUpdateClientSubOrder(order,cartitem)
        return res.json({
            data: {
                order: order,
                cartitem: cartitem
            }
        })
    }catch(err){
        return next(err)
    }
})

router.get('/suborders',
(req,res,next)=>{
    console.log("CHECKING DIS",req.query)

    const {value,error} = (fetchSubOrdersSchema.validate(req.query))
    if(error)
        return next(error)
    req.query = value
        return next()
},
async (req,res,next)=>{
    try{
        const search_params : any = req.query
        const data = await Orders.GetSubOrders(search_params.order_ref || undefined,search_params)
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
        const data = await Orders.GetOrderById(id)
        return res.send({
            data: data
        })
    }catch(err){
        return next(err)
    }
})
router.get('/',
(req,res,next)=>{

    const {value,error} = (fetchOrdersSchema.validate(req.query))
    if(error)
        return next(error)
    req.query = value
        return next()
}
,async (req,res,next)=>{
    const search_params = req.query
    console.log(search_params)
    try{
        const data = await Orders.GetOrders(search_params || {})
        return res.send({
            data: data
        })
    }catch(err){
        return next(err)
    }
})

router.delete('/:id',OAuth.SignedIn,OAuth.HasAccess({orders: "manage"}),async (req,res,next)=>{
    const {id} = req.params
    try{
        const data = await Orders.DeleteOrderById(id)
        return res.send({
            data: data
        })

    }catch(err){
        return next(err)
    }
})

router.get("/",(req,res)=>{
    return res.send("Hii Invoices")
})*/
export default router