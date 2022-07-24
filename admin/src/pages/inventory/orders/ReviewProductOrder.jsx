import { useNavigate, useParams } from "react-router-dom"
import {GetProductOrderById} from "../../../lib/ProductsDal.jsx"
import Loading from "../../../components/Loading"
import Error from "../../../components/Error"
import * as ROUTES from "../../../ROUTES"
import { useContext } from "react"
import { UserContext } from "../../../contexts"
import {motion} from "framer-motion"
import { FadeIn } from "../../../animations"
import { formatFbDate } from "../../../lib/utils.js"
import moment from "moment"

const ReviewProductOrder =()=>{
    const {productid,orderid} = useParams()
    const {result : product,loading,error} = GetProductOrderById(productid,orderid)
    const user = useContext(UserContext)
    const usenav = useNavigate()
    if( error)
        return <Error msg={"Error while retrieving Food information " + productid} error={error} />
    if( loading)
        return <Loading />
    return  <>
    <motion.div variants={FadeIn()} className="data-review">
        <div className="data-review-header">
            <h1><span>Name: </span>{product.name}</h1>
            <div>
                {user.profile.permissions.tables.manage && <><button onClick={(e)=>{
                    usenav(ROUTES.INVENTORY.GET_UPDATE_PRODUCT_ORDER(productid,orderid))
                }}>Update</button>
                <button onClick={async (e)=>{
                    try{
                        usenav(ROUTES.INVENTORY.ALL)
                    }catch(err){
                        console.log(err)
                    }
                }}>Delete</button>
                </>}
            </div>
        </div>
        <div className="data-review-body">
            <h2><span>Purshase Time:</span> {formatFbDate(product.time,true)}</h2>
            <h2><span>Expires In :</span> {formatFbDate(product.expiresIn,true)} : {moment(product.expiresIn.toDate()).fromNow()}</h2>
            <h2><span>Price/U:</span> {product.unitPrice} Millime</h2>
            <h2><span>Quantity/U:</span> {product.unitQuantity}</h2>  
            <h2><span>Purshase Quantity:</span> {product.productQuantity}</h2>
            <h2><span>Used:</span> {product.used}</h2>
            <h2><span>Wasted:</span> {product.wasted}</h2>
        </div>
    </motion.div >
    </>
}

export default ReviewProductOrder