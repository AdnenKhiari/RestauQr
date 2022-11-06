import {Router} from "express"
import ProductOrders from "../../../../DataAcessLayer/Suppliers/ProductOrders"
import { Request } from "express"
import joi from "joi"
import OAuth from "../../Authorisation"

const router = Router()



router.post('/',async (req,res,next)=>{
    try{
        const supplierid: string = <string>req.supplierid
        const data = req.body
        const result = await ProductOrders.AddUpdateProductOrder(data,supplierid,undefined)
        return res.json({data: {id: result}})
    }catch(err){
        return next(err)
    }
})
router.put('/:id',async (req,res,next)=>{
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

router.get('/:id',async (req,res,next)=>{
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
/*
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