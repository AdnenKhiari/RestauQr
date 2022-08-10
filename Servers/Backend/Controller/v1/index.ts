import Food from "./Food"
import Tables from "./Tables"
import Orders from "./Orders"
import Products from "./Inventory/Products"

import Express, { Router } from "express"
const router = Router()



router.use("/food",Food)
router.use("/tables",Tables)
router.use("/orders",Orders)
router.use("/products",Products)

export default router