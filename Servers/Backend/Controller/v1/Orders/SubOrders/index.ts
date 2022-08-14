import {Router} from "express"
import Orders from "../../../../DataAcessLayer/Orders"
import joi from "joi"
import OAuth from "../../Authorisation"
const router = Router()
const productsOrderInfoSchema = joi.object({
    id: joi.string().optional().label('Item Id'),
    name: joi.string().required().label('Item Name'),
    productQuantity: joi.number().min(0).required().label('Item Quantity :'),
    unitQuantity: joi.number().min(0).required().label('Quantity/U'),
    unitPrice: joi.number().min(0).required().label('Price/U'),
    time: joi.date().required().label('Time'),
    expiresIn: joi.date().required().label('Expires In')
})

const fetchSubOrders  = joi.object({
    tableid: joi.number().allow('').optional().label("Table Id"),
    startDate: joi.date().allow('').optional().label('Start Order Date'),
    endDate: joi.date().allow('').optional().label('End Order Date'),
    lastRef : joi.string().optional().label("Last Reference"),
    swapped: joi.boolean().optional().default(false).label("Swapped"),
    dir: joi.allow('desc','asc').default('desc').optional().label("Direction")
})

router.get('/:subid',OAuth.HasAccess({orders: "read"}),async (req,res,next)=>{
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
router.get('/',OAuth.HasAccess({orders: "read"}),
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

router.put('/:subid',OAuth.HasAccess({orders: "manage"}),(req,res,next)=>{

    const {value,error} = (productsOrderInfoSchema.validate(req.body))
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
        return res.send({
            data: result
        })
    }catch(err){
        return next(err)
    }
})
router.delete('/:id',OAuth.HasAccess({orders: "manage"}),async (req,res,next)=>{
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