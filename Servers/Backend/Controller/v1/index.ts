
import Express, { Router } from "express"

import Food from "./Food"
import Tables from "./Tables"
import Orders from "./Orders"
import Products from "./Inventory/Products"
import Auth from "./Authentication"
import Users from "./Users"
import Categories from "./Categories"
import Units from "./Units"
import Suppliers from "./Suppliers"

import PushNotifications from "./PushNotification"
import { nextTick } from "process"
const router = Router()

router.use("/food",Food)
router.use("/tables",Tables)
router.use("/orders",Orders)
router.use("/products",Products)
router.use("/auth",Auth)
router.use("/categories",Categories)
router.use("/units",Units)
router.use("/suppliers",Suppliers)
router.use("/users",Users)

router.use("/pushnot",PushNotifications)

if(process.env.NODE_ENV !== "production"){
    const error_out = ()=>{
        throw Error("Custom Error Thrown in purpose")
    }
    router.get("/error",async (req,res,next)=>{
        try{
            error_out()
        }catch(err){
            return next(err)
        }
        return res.send("mrigel")
    })
}
export default router