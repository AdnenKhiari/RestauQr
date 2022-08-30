
import Express, { Router } from "express"

import Food from "./Food"
import Tables from "./Tables"
import Orders from "./Orders"
import Products from "./Inventory/Products"
import Auth from "./Authentication"
import Users from "./Users"
import Categories from "./Categories"
import Payments from "./Payments"

import PushNotifications from "./PushNotification"
const router = Router()

router.use("/food",Food)
router.use("/tables",Tables)
router.use("/orders",Orders)
router.use("/products",Products)
router.use("/auth",Auth)
router.use("/categories",Categories)
router.use("/users",Users)
router.use("/payments",Payments)

router.use("/pushnot",PushNotifications)
export default router