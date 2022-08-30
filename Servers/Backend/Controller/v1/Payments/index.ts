import Express from "express"
import Stripe from "./Stripe"

const router = Express.Router()


router.use("/stripe",Stripe)
export default router