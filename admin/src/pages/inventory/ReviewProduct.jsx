import { useNavigate, useParams } from "react-router-dom"
import {ConsumeProductItem, GetProductById, RemoveProduct} from "../../lib/ProductsDal.jsx"
import Loading from "../../components/Loading"
import Error from "../../components/Error"
import * as ROUTES from "../../ROUTES"
import { useContext } from "react"
import { UserContext } from "../../contexts"
import {motion} from "framer-motion"
import { FadeIn } from "../../animations"
import ProductOrdersTable from "../../components/Tables/ProductOrdersTable.jsx"
import joi from "joi"
import { joiResolver } from "@hookform/resolvers/joi"
import { useForm } from "react-hook-form"


const schema = joi.object({
    used: joi.number().required().default(0).label("Use"),
    wasted: joi.number().required().default(0).label("Wasted"),
})

const ReviewProduct =()=>{
    const {productid} = useParams()
    const {result : product,loading,error} = GetProductById(productid)
    const user = useContext(UserContext)
    const usenav = useNavigate()
    const del = RemoveProduct(productid)
    const consume = ConsumeProductItem(productid)

    const {register,handleSubmit, formState : {errors}} = useForm({
        resolver: joiResolver(schema),
        defaultValues: {
            used: 0,
            wasted: 0
        }
    })

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
                    usenav(ROUTES.INVENTORY.GET_UPDATE_PRODUCT(productid))
                }}>Update</button>
                <button onClick={(e)=>usenav(ROUTES.INVENTORY.GET_ADD_PRODUCT_ORDER(productid))}>New Order</button>

                <button onClick={async (e)=>{
                    try{
                        await del.remove()
                        usenav(ROUTES.INVENTORY.ALL)
                    }catch(err){
                        console.log(err)
                    }
                }}>Delete</button>
                </>}
            </div>
        </div>
        <div className="data-review-body secondary-form">
            <h2><span>Price/U:</span> {product.sellingUnitPrice} Millime</h2>
            <h2><span>Quantity/U:</span> {product.unitQuantity}{product.unit}</h2>  
            <h2><span>Available In Stock:</span> {product.stockQuantity}{product.unit}</h2>
            <div>
            <form onSubmit={handleSubmit(async (data)=>{
                console.log(data)
                await consume.mutate(data)
                usenav(0)
            })}>
                <div className="input-item">
                    <div>
                        <label htmlFor="use">Use</label>
                        <input placeholder="Use..." className="secondary-input" id="use" type="number" {...register("used")} />
                    </div>
                    <div >    
                        <label htmlFor="waste">Waste</label>
                        <input placeholder="Waste.." className="secondary-input" id="waste" type="number" {...register("wasted")} />
                    </div>
                    <button type="submit">Update</button>  
                </div>
            </form>
            {errors && errors["wasted"] && <p className="error">{errors["wasted"].message.replaceAll('"',"")}</p>}
            {errors && errors["used"] && <p className="error">{errors["used"].message.replaceAll('"',"")}</p>}
            </div>
        </div>
    </motion.div >
    <ProductOrdersTable  title={'All Orders'} parentid={productid}  />

    </>
        //queryConstraints={{order_ref: productid }}
            
}

export default ReviewProduct