import { Link, useNavigate, useParams } from "react-router-dom"
import {ConsumeProductOrderItem, GetProductOrderById, RemoveProductOrder} from "../../../lib/ProductsDal.jsx"
import Loading from "../../../components/Loading"
import Error from "../../../components/Error"
import * as ROUTES from "../../../ROUTES"
import { useContext } from "react"
import { UserContext } from "../../../contexts"
import {motion} from "framer-motion"
import { FadeIn } from "../../../animations"
import { formatFbDate } from "../../../lib/utils.js"
import {useForm} from "react-hook-form"
import joi from "joi"
import{joiResolver} from "@hookform/resolvers/joi"
import moment from "moment"

const schema = joi.object({
    used: joi.number().required().default(0).label("Use"),
    wasted: joi.number().required().default(0).label("Wasted"),
})
const ReviewProductOrder =()=>{
    const {productid,orderid} = useParams()
    const {result : product,loading,error} = GetProductOrderById(productid,orderid)
    const user = useContext(UserContext)
    const usenav = useNavigate()
    const {register,handleSubmit, formState : {errors}} = useForm({
        resolver: joiResolver(schema),
        defaultValues: {
            used: 0,
            wasted: 0
        }
    })
    const consume = ConsumeProductOrderItem(productid,orderid)
    const del = RemoveProductOrder(productid,orderid)
    if( error)
        return <Error msg={"Error while retrieving Food information " + productid} error={error} />
    if( loading)
        return <Loading />
        console.log(errors)
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
                        await del.remove()
                        usenav(ROUTES.INVENTORY.GET_REVIEW_PRODUCT(productid))
                    }catch(err){
                        console.log(err)
                    }
                }}>Delete</button>
                </>}
            </div>
        </div>
        <div className="data-review-body secondary-form">
            <h2><span>Purshase Time:</span> {formatFbDate(product.time,true)}</h2>
            <h2><span>Expires In :</span> {formatFbDate(product.expiresIn,true)} : {moment(product.expiresIn.toDate()).fromNow()}</h2>
            <h2><span>Price/U:</span> {product.unitPrice} Millime</h2>
            <h2><span>Quantity/U:</span> {product.unitQuantity}</h2>  
            <h2><span>Purshase Quantity:</span> {product.productQuantity}</h2>
            <h2><span>Used:</span> {product.used}</h2>
            <h2><span>Wasted:</span> {product.wasted}</h2>
            <h2><Link to={ROUTES.INVENTORY.GET_REVIEW_PRODUCT(productid)}>Go To Product</Link></h2>

            <form onSubmit={(e)=>e.preventDefault()}>
                <div className="input-item">
                    <div>
                        <label htmlFor="use">Use</label>
                        <input placeholder="Use..." className="secondary-input" id="use" type="number" {...register("used")} />
                    </div>
                    <div >    
                        <label htmlFor="waste">Waste</label>
                        <input placeholder="Waste.." className="secondary-input" id="waste" type="number" {...register("wasted")} />
                    </div>
                    <button onClick={handleSubmit(async (data)=>{
                        console.log(data)
                        await consume.mutate(data,false)
                        usenav(0)
                    })} type="button">Update</button>  
                    <button onClick={handleSubmit(async (data)=>{
                    console.log(data)
                    await consume.mutate(data,true)
                    usenav(0)
                })} type="button">Update Globally</button>  
                </div>
            </form>
            {errors && errors["wasted"] && <p className="error">{errors["wasted"].message.replaceAll('"',"")}</p>}
            {errors && errors["used"] && <p className="error">{errors["used"].message.replaceAll('"',"")}</p>}
        </div>
    </motion.div >
    </>
}

export default ReviewProductOrder