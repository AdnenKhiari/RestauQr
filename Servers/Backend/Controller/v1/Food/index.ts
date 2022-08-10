import {Router} from "express"
const router = Router()


router.get('/:id',(req,res)=>{
    const {id} = req.params
    console.log(id)
    return res.send(id)
})
router.post('/:id',(req,res)=>{
    const bd = req.body
    return res.send(bd)
})
router.put('/:id',(req,res)=>{
    const bd = req.body
    return res.send(bd)
})
router.delete('/:id',(req,res)=>{
    const bd = req.body
    return res.send(bd)
})

router.get("/",(req,res)=>{
    return res.send("Hii Food")
})
export default router