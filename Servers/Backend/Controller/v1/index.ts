import Food from "./Food"
import Express, { Router } from "express"
const router = Router()



router.use("/food",Food)
export default router