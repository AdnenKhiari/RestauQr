import { useNavigate, useParams } from "react-router-dom"
import {GetProductById} from "../../lib/ProductsDal.jsx"
import Loading from "../../components/Loading"
import Error from "../../components/Error"
import * as ROUTES from "../../ROUTES"
import { useContext } from "react"
import { UserContext } from "../../contexts"
import {motion} from "framer-motion"
import { FadeIn } from "../../animations"
import ProductOrdersTable from "../../components/Tables/ProductOrdersTable.jsx"

const ReviewProduct =()=>{
    const {productid} = useParams()
    const {result : product,loading,error} = GetProductById(productid)
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
                    usenav(ROUTES.INVENTORY.GET_UPDATE_PRODUCT(productid))
                }}>Update</button>
                <button onClick={(e)=>usenav(ROUTES.INVENTORY.GET_ADD_PRODUCT_ORDER(productid))}>New Order</button>

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
            <h2><span>Price/U:</span> {product.sellingUnitPrice} Millime</h2>
            <h2><span>Quantity/U:</span> {product.unitQuantity}{product.unit}</h2>  
            <h2><span>Available In Stock:</span> {product.stockQuantity}{product.unit}</h2>
        </div>
    </motion.div >
    <ProductOrdersTable title={'All Orders'} parentid={productid}  />

    </>
}

export default ReviewProduct