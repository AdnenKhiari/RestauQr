import { Link, useNavigate, useParams } from "react-router-dom"
import {ConsumeMerchandiseItem, GetProductById, GetMerchandiseById, RemoveMerchandise} from "../../../lib/ProductsDal.jsx"
import Loading from "../../../components/Loading"
import Error from "../../../components/Error"
import * as ROUTES from "../../../ROUTES"
import { useContext } from "react"
import { UserContext } from "../../../contexts"
import {motion} from "framer-motion"
import { FadeIn } from "../../../animations"
import { formatFbDate, getLevel } from "../../../lib/utils.js"
import {useForm} from "react-hook-form"
import joi from "joi"
import{joiResolver} from "@hookform/resolvers/joi"
import moment from "moment"
import {GetUnits} from "../../../lib/Units"
import UnitValue,{unitvalueschema} from "../../../components/Custom/UnitValue"
import UnitShow from "../../../components/Custom/UnitShow"

const schema = joi.object({
    used: unitvalueschema.label("Use"),
    wasted: unitvalueschema.label("Wasted"),    
})
const ReviewMerchandise =()=>{
    const {productid,orderid} = useParams()
    const {result : productorder,loading,error} = GetMerchandiseById(productid,orderid)
    const {result : product,loading: loadingproduct,error: errorproduct} = GetProductById(productid)
    const {result: allunits,loading: allunitsloading,error: allunitserror} = GetUnits()
    console.warn("XDDD",product,loadingproduct,errorproduct,productorder,allunits)

    const user = useContext(UserContext)
    const usenav = useNavigate()
    const {control,register,handleSubmit, formState : {errors}} = useForm({
        resolver: joiResolver(schema)
    })
    const processData = (data)=>{
        const sendata = {
            used: data.used = data.used.value * (data.used.unit.subunit ? data.used.unit.subunit.ratio : 1),
            wasted:  data.wasted.value * (data.wasted.unit.subunit ? data.wasted.unit.subunit.ratio : 1)  
        }
        return sendata
    }
    const consume = ConsumeMerchandiseItem(productid,orderid)
    const del = RemoveMerchandise(productid,orderid)
    if( error || allunitserror || errorproduct)
        return <>
        {error && <Error msg={"Error while retrieving Merchandise information " + productid + ","+orderid} error={error} />}
        {errorproduct && <Error msg={"Error while retrieving Product information " + productid} error={errorproduct} />}
        {allunitserror && <Error msg={"Error while retrieving AllUnits information "} error={allunitserror} />}
        </>
    if( loading || allunitsloading || loadingproduct)
        return <Loading />
    return  <>
    <motion.div variants={FadeIn()} className="data-review">
        <div className="data-review-header">
            <h1><span>Name: </span>{productorder.name}</h1>
            <div>
                
                {getLevel(user.profile.permissions.tables) >=getLevel("manage") && <><button onClick={(e)=>{
                    usenav(ROUTES.INVENTORY.GET_UPDATE_PRODUCT_MERCHANDISE(productid,orderid))
                }}>Update</button>
                <button onClick={(e)=>usenav(ROUTES.INVENTORY.GET_REVIEW_PRODUCT(productid))}>Related Product</button>
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
            <h2><span>Purshase Time:</span> {formatFbDate(productorder.time,true)}</h2>
            <h2><span>Expires In :</span> {formatFbDate(productorder.expiresIn,true)} : {moment(productorder.expiresIn._seconds*1000 + productorder.expiresIn._nanoseconds / 1000).fromNow()}</h2>
            <h2><span>Price/U:</span> {productorder.unitPrice} Millime</h2>
            <h2><span>Quantity/U:</span> <UnitShow  unitval={{value: productorder.unitQuantity,unit: product.unit}} /></h2>  
            <h2><span>Purshase Quantity:</span> {productorder.productQuantity}</h2>
            <h2><span>Used:</span> {productorder.used}</h2>
            <h2><span>Wasted:</span> {productorder.wasted}</h2>

            <form onSubmit={(e)=>e.preventDefault()}>
                <div className="input-item">
                    <div>
                        <label htmlFor="use">Use</label>
                        <UnitValue  inputcustomprops={{placeholder:"Use...", className:"secondary-input" ,id:"use"}}
                          register={register}  
                          name="used" 
                          control={control}  
                          defaultValue={{value: 0,units: product.unit}} 
                          units={allunits.filter((un)=>un.id === product.unit.id)} />                    </div>
                    <div >    
                        <label htmlFor="waste">Waste</label>
                        <UnitValue  inputcustomprops={{placeholder:"Waste...", className:"secondary-input" ,id:"waste"}}
                          register={register}  
                          name="wasted" 
                          control={control} 
                          defaultValue={{value: 0,units: product.unit}} 
                          units={allunits.filter((un)=>un.id === product.unit.id)} />                     </div>
                                              <button onClick={handleSubmit(async (data)=>{
                    data = processData(data)
                    console.log(data)
                    await consume.mutate(data,true)
                    usenav(0)
                })} disabled={consume.loading} type="button">Update</button> 
                    <button onClick={handleSubmit(async (data)=>{
                        console.log(data)
                        data = processData(data)
                        await consume.mutate(data,false)
                        usenav(0)
                    })} disabled={consume.loading} type="button">Update Locally</button>  
 
                </div>
            </form>
            {errors && errors["wasted"] && <p className="error">{errors["wasted"].message.replaceAll('"',"")}</p>}
            {errors && errors["used"] && <p className="error">{errors["used"].message.replaceAll('"',"")}</p>}
        </div>
    </motion.div >
    </>
}

export default ReviewMerchandise