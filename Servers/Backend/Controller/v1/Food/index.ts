import {Router} from "express"
import  Food from "../../../DataAcessLayer/Food"
const router = Router()

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
router.post('/',async (req,res,next)=>{
    const data = req.body
    try{
        console.log("Creating Food",data)
        const result = await Food.AddUpdateFood(data,undefined)
        return res.send({
            data: result
        })
    }catch(err){
        return next(err)
    }
})
router.put('/:id',async (req,res,next)=>{
    const data = req.body
    const {id} = req.params
    try{
        const result = await Food.AddUpdateFood(data,id)
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