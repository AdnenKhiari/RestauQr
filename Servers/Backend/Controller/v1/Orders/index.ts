import {Router} from "express"
import Orders from "../../../DataAcessLayer/Orders"
import SubOrders from "./SubOrders"
import { Request } from "express"
import joi from "joi"
const router = Router()

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
    swapped: joi.boolean().optional().default(false).label("Swapped"),
    dir: joi.allow('desc','asc').default('desc').optional().label("Direction")
})
const orderSchema = joi.object({
    status: joi.string().allow("paid","unpaid")
})
router.post('/clientOrder',async (req,res,next)=>{
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
router.put('/clientOrder',async (req,res,next)=>{
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

    const {value,error} = (fetchSubOrdersSchema.validate(req.query))
    if(error)
        return next(error)
    req.query = value
        return next()
},
async (req,res,next)=>{
    try{
        const search_params = req.query
        const data = await Orders.GetSubOrders(undefined,search_params)
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

router.put('/:orderid',
(req,res,next)=>{
    const {value,error} = (orderSchema.validate(req.body))
    if(error)
        return next(error)
    req.body = value
        return next()
},async (req,res,next)=>{
    const data = req.body
    const orderid = req.params.orderid
    try{
        const result = await Orders.UpdateOrder(orderid,data)
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
        const data = await Orders.DeleteOrderById(id)
        return res.send({
            data: data
        })

    }catch(err){
        return next(err)
    }
})
router.use('/:orderid/suborders',(req: Request,res,next)=>{
    req.orderid = <string>req.params.orderid
    return SubOrders(req,res,next)
})


router.get("/",(req,res)=>{
    return res.send("Hii Orders")
})
export default router