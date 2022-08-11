
import Express, { Router } from "express"

import Food from "./Food"
import Tables from "./Tables"
import Orders from "./Orders"
import Products from "./Inventory/Products"
import Auth from "./Authentication"
import Users from "./Users"

const router = Router()

router.use("/food",Food)
router.use("/tables",Tables)
router.use("/orders",Orders)
router.use("/products",Products)
router.use("/auth",Auth)
router.use("/users",Users)

export default router