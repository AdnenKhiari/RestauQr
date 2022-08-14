import {Router} from "express"
import  Tables from "../../../DataAcessLayer/Tables"
import joi from "joi"
import OAuth from "../Authorisation"
const router = Router()

router.get('/:id',async (req,res,next)=>{
    const id: string = req.params.id
    try{
        const data = await Tables.GetTableById(id)
        return res.send({
            data: data
        })
    }catch(err){
        return next(err)
    }
})



router.get('/',
(req,res,next)=>{
    const schema  = joi.object({
        disabled: joi.bool().allow('').optional().label("Disabled Only"),
        id: joi.string().allow('').optional().label("Id"),
        placesNum: joi.number().allow('').optional().label("Number Of Places"),
        startDate: joi.date().allow('').optional().label('Start Purshase Date'),
        endDate: joi.date().allow('').optional().label('End Purshase Date'),
        lastRef : joi.string().optional().label("Last Reference"),
        swapped: joi.boolean().optional().default(false).label("Swapped"),
        dir: joi.allow('desc','asc').default('desc').optional().label("Direction")
    })
    const {value,error} = (schema.validate(req.query))
    if(error)
        return next(error)
    req.query = value
        return next()
}
,async (req,res,next)=>{
    const search_params = req.query
    console.log(search_params)
    try{
        const data = await Tables.GetTables(search_params || {})
        return res.send({
            data: data
        })
    }catch(err){
        return next(err)
    }
})
router.post('/',OAuth.HasAccess({tables: "manage"}),
(req,res,next)=>{

    const schema = joi.object({
        id: joi.string().required().label("Table Id"),
        placesNum: joi.number().min(1).required().label('Table Capacity'),
        disabled: joi.bool().required().label('Disabled'),
        time: joi.date().required().label('Pushase Date')
    })
    const {value,error} = (schema.validate(req.body))
    if(error)
        return next(error)
    req.body = value
        return next()
}
,
async (req,res,next)=>{
    const data = req.body
    try{
        const result = await Tables.AddUpdateTable(data.id,data)
        return res.send({
            data: {
                id: result
            }
        })
    }catch(err){
        return next(err)
    }
})
router.put('/:id',OAuth.HasAccess({tables: "manage"}),
(req,res,next)=>{

    const schema = joi.object({
        id: joi.string().optional().label("Table Id"),
        placesNum: joi.number().min(1).optional().label('Table Capacity'),
        disabled: joi.bool().optional().label('Disabled'),
        time: joi.date().optional().label('Pushase Date')
    })
    const {value,error} = (schema.validate(req.body))
    if(error)
        return next(error)
    req.body = value
        return next()
}
,async (req,res,next)=>{
    const data = req.body
    const id = req.params.id
    try{
        const result = await Tables.AddUpdateTable(id,data)
        return res.send({
            data: {
                id: result
            }
        })
    }catch(err){
        return next(err)
    }
})
router.delete('/:id',OAuth.HasAccess({tables: "manage"}),async (req,res,next)=>{
    const {id} = req.params
    try{
        const data = await Tables.DeleteTableById(id)
        return res.send({
            data: data
        })

    }catch(err){
        return next(err)
    }
})

router.get("/",(req,res)=>{
    return res.send("Hii Tables")
})
export default router