import {Router} from "express"
import Orders from "../../../../DataAcessLayer/Orders"
import joi from "joi"
import OAuth from "../../Authorisation"
import {sendNotificationToOrder} from "../../../../DataAcessLayer/PushNotification"

const router = Router()
const subordersInfoSchema = joi.object({
    status: joi.string().required().label('Status'),
    reason: joi.string().allow("").optional().label('Reason to cancel'),
})

const fetchSubOrders  = joi.object({
    tableid: joi.number().allow('').optional().label("Table Id"),
    startDate: joi.date().allow('').optional().label('Start Order Date'),
    endDate: joi.date().allow('').optional().label('End Order Date'),
    lastRef : joi.string().optional().label("Last Reference"),
    swapped: joi.boolean().optional().default(false).label("Swapped"),
    dir: joi.allow('desc','asc').default('desc').optional().label("Direction")
})

router.get('/:subid',async (req,res,next)=>{
    const subid: string = req.params.subid
    const orderid: string = <string>req.orderid
    console.log(subid,orderid)
    try{
        const data = await Orders.GetSubOrderById(orderid,subid)
        return res.send({
            data: data
        })
    }catch(err){
        return next(err)
    }
})
router.get('/',
(req,res,next)=>{
    const {value,error} = (fetchSubOrders.validate(req.query))
    if(error)
        return next(error)
    req.query = value
        return next()
}
,async (req,res,next)=>{
    const search_params = req.query
    const orderid: string = <string>req.orderid
    console.log(search_params)
    try{
        const data = await Orders.GetSubOrders(orderid,search_params || {})
        return res.send({
            data: data
        })
    }catch(err){
        return next(err)
    }
})

router.put('/:subid',OAuth.SignedIn,OAuth.HasAccess({orders: "manage"}),(req,res,next)=>{
    const {value,error} = (subordersInfoSchema.validate(req.body))
    if(error)
        return next(error)
    req.body = value
        return next()
},async (req,res,next)=>{
    const data = req.body
    const orderid: string = <string>req.orderid
    const subid = req.params.subid
    try{
        const result = await Orders.UpdateSubOrder(orderid,subid,data)
        await sendNotificationToOrder({type: "food-status",status: data.status,orderid: orderid,subid: subid},orderid)
        return res.send({
            data: result
        })
    }catch(err){
        return next(err)
    }
})
router.delete('/:id',OAuth.SignedIn,OAuth.HasAccess({orders: "manage"}),async (req,res,next)=>{
    const {id} = req.params
    const orderid: string = <string>req.orderid

    try{
        const data = await Orders.RemoveClientSubOrder(orderid,id)
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
    return res.send("Hii Sub Orders")
})
export default router