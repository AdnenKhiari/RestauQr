import {Router} from "express"
import ProductTemplates from "../../../../../DataAcessLayer/Inventory/Products/productTemplates"
import joi from "joi"
import OAuth from "../../../Authorisation"
const router = Router()


const TemplateSchema = joi.object({
    name: joi.string().required().label('Product Template Name'),
    notes: joi.string().required().label('Product Template Notes'),
    custom_fields : joi.array().items(
        joi.object({
            id: joi.string().optional(),
            label: joi.string().required().label("Label"),
            name: joi.string().required().label("Name"),
            type: joi.string().valid("list-select","select","decimal","integer","short-text","long-text","date","date-time").required().label("Type"),
            choices: joi.alternatives().conditional('type',[
                {is: "select",then: joi.array().items(joi.string()).required()},
                {is: "list-select",then: joi.array().items(joi.string()).required(),
                otherwise: joi.forbidden()}
            ]).label("Choices"),
        }).required()
    ).required()
})

router.post('/',OAuth.SignedIn,OAuth.HasAccess({inventory: "manage"}),
(req,res,next)=>{
    const {value,error} = (TemplateSchema.validate(req.body))
    if(error)
        return next(error)
    req.body = value
        return next()
},async (req,res,next)=>{
    const data  : any = req.body
    const productid = <string>req.productid
    try{
        const result = await ProductTemplates.AddUpdateTemplate(data,productid)
        return res.send({   
            data: {
                id: result
            }
        })
    }catch(err){
        return next(err)
    }
})
router.put('/',OAuth.SignedIn,OAuth.HasAccess({inventory: "manage"}),
(req,res,next)=>{
    const {value,error} = (TemplateSchema.validate(req.body))
    if(error)
        return next(error)
    req.body = value
        return next()
},async (req,res,next)=>{
    const data  : any = req.body
    const productid = <string>req.productid  
    try{
        const result = await ProductTemplates.AddUpdateTemplate(data,productid)
        return res.send({   
            data: {
                id: result
            }
        })
    }catch(err){
        return next(err)
    }
})
router.delete('/',OAuth.SignedIn,OAuth.HasAccess({inventory: "manage"}),async (req,res,next)=>{
    try{
        const productid = <string>req.productid  
        const data : any= await ProductTemplates.DeleteTemplate(productid)
        return res.send({
            data: data
        })

    }catch(err){
        return next(err)
    }
})

router.get("/",(req,res)=>{
    return res.send("Hii Product Templates")
})
export default router