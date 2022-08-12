import {Router} from "express"
import  Food from "../../../DataAcessLayer/Food"
const router = Router()
import joi from "joi"

router.get('/:id',async (req,res,next)=>{
    const id: string = req.params.id
    try{
        const data = await Food.GetFoodById(id)
        return res.send({
            data: data
        })
    }catch(err){
        return next(err)
    }
})
router.get('/',async (req,res,next)=>{
    const categories : string[] | string = <string[] | string>req.query.categories
    console.log(categories)
    try{
        const data = await Food.GetFoods(<string[]>(typeof(categories) === "string" ? [categories] : categories))
        return res.send({
            data: data
        })
    }catch(err){
        return next(err)
    }
})
router.post('/',
(req,res,next)=>{

    const productSchema = joi.object({
        id: joi.string().optional() ,
        name : joi.string().required().label("Name"),
        quantity : joi.number().required().label("Quantity"),
        unit: joi.string(),
        sellingUnitPrice: joi.number(),
        unitQuantity: joi.number()
    }).optional()
    
    const ingredientsSchema = joi.object({
        options: joi.array().optional().items(
        joi.object({
            msg: joi.string().required().label('Item Message'),
            type: joi.allow('check').required(),
            price: joi.number().min(0).required().label('Item Price'),
            ingredients: joi.link('#ingr').optional()
        }).optional()
        , 
        joi.object({
            msg: joi.string().required().label('Item Message'),
            type: joi.allow('select').required(),
            choices: joi.array().optional().items(joi.object({
                msg: joi.string().required().label('Item Selection Message'),
                price: joi.number().min(0).label('Item Selection Price'),
                ingredients: joi.link('#ingr').optional()
            }))
        }).optional()),
        products: joi.array().items(productSchema).label("Products")
    
    }).id("ingr")
    
    
    const schema = joi.object({
        title: joi.string().required().label('Food Name'),
        description: joi.string().required().label('Food Description'),
        category: joi.string().required().label('Food Category'),
        img: joi.any().required().label('Food Image'),
        price: joi.number().min(0).required().label('Food Price'),
        ingredients: ingredientsSchema
    })

    const {value,error} = (schema.validate(req.body))
    if(error)
        return next(error)
    req.body = value
        return next()
}
,async (req,res,next)=>{
    const data = req.body
    try{
        const result = await Food.AddUpdateFood(data,undefined)
        return res.send({
            data:  {
                id: result
            }
        })
    }catch(err){
        return next(err)
    }
})
router.put('/:id',
(req,res,next)=>{

    const productSchema = joi.object({
        id: joi.string().optional() ,
        name : joi.string().required().label("Name"),
        quantity : joi.number().required().label("Quantity"),
        unit: joi.string(),
        sellingUnitPrice: joi.number(),
        unitQuantity: joi.number()
    }).optional()
    
    const ingredientsSchema = joi.object({
        options: joi.array().optional().items(
        joi.object({
            msg: joi.string().required().label('Item Message'),
            type: joi.allow('check').required(),
            price: joi.number().min(0).required().label('Item Price'),
            ingredients: joi.link('#ingr').optional()
        }).optional()
        , 
        joi.object({
            msg: joi.string().required().label('Item Message'),
            type: joi.allow('select').required(),
            choices: joi.array().optional().items(joi.object({
                msg: joi.string().required().label('Item Selection Message'),
                price: joi.number().min(0).label('Item Selection Price'),
                ingredients: joi.link('#ingr').optional()
            }))
        }).optional()),
        products: joi.array().items(productSchema).label("Products")
    
    }).id("ingr")
    
    
    const schema = joi.object({
        title: joi.string().required().label('Food Name'),
        description: joi.string().required().label('Food Description'),
        category: joi.string().required().label('Food Category'),
        img: joi.any().required().label('Food Image'),
        price: joi.number().min(0).required().label('Food Price'),
        ingredients: ingredientsSchema
    })

    const {value,error} = (schema.validate(req.body))
    if(error)
        return next(error)
    req.body = value
        return next()
},
async (req,res,next)=>{
    const data = req.body
    const {id} = req.params
    try{
        const result = await Food.AddUpdateFood(data,id)
        return res.send({
            data: {
                id: result
            }
        })
    }catch(err){
        return next(err)
    }
})
router.delete('/:id',async (req,res,next)=>{
    const {id} = req.params
    try{
        const data = await Food.DeleteFoodById(id)
        return res.send({
            data: data
        })

    }catch(err){
        return next(err)
    }
})

router.get("/",(req,res)=>{
    return res.send("Hii Food")
})
export default router