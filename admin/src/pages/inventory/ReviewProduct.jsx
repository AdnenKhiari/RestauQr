import { useNavigate, useParams } from "react-router-dom"
import {ConsumeProductItem, GetProductById, RemoveProduct} from "../../lib/ProductsDal.jsx"
import Loading from "../../components/Loading"
import Error from "../../components/Error"
import * as ROUTES from "../../ROUTES"
import { useContext } from "react"
import { UserContext } from "../../contexts"
import {motion} from "framer-motion"
import { FadeIn } from "../../animations"
import MerchandiseTable from "../../components/Tables/MerchandiseTable.jsx"
import joi from "joi"
import { joiResolver } from "@hookform/resolvers/joi"
import { useForm } from "react-hook-form"
import { getLevel } from "../../lib/utils.js"
import UnitShow from "../../components/Custom/UnitShow.jsx"
import { GetUnits } from "../../lib/Units.jsx"
import UnitValue, { unitvalueschema } from "../../components/Custom/UnitValue.jsx"
import {TemplatePreview} from "../../components/ProductTemplatesInfo"
import { RemoveProductTemplate } from "../../lib/ProductTemplates.jsx"

const schema = joi.object({
    used: unitvalueschema.label("Use"),
    wasted: unitvalueschema.label("Wasted"),    
})
export const ReviewProductUi = ({productid})=>{
        const {result : product,loading,error} = GetProductById(productid)
        const user = useContext(UserContext)
        const usenav = useNavigate()
        const del = RemoveProduct(productid)
        const consume = ConsumeProductItem(productid)
        const {result: allunits,loading: allunitsloading,error: allunitserror} = GetUnits()
        const {watch,register,handleSubmit, formState : {errors},control} = useForm({
            resolver: joiResolver(schema)
        })
        const removetemplate = RemoveProductTemplate(productid)
        if( error || allunitserror )
            return <>
            {error && <Error msg={"Error while retrieving Product information " + productid} error={error} />}
            {allunitserror && <Error msg={"Error while retrieving Units information "} error={allunitserror} />}
            </>
    
        if( loading || allunitsloading)
            return <Loading />
        //console.log(watch())
        return  <>
    
        <motion.div variants={FadeIn()} className="data-review">
            <div className="data-review-header">
                <h1><span>Name: </span>{product.name}</h1>
                <div>
                    {getLevel(user.profile.permissions.inventory) >= getLevel("manage") && <><button onClick={(e)=>{
                        usenav(ROUTES.INVENTORY.GET_UPDATE_PRODUCT(productid))
                    }}>Update</button>
                    <button onClick={(e)=>usenav(ROUTES.INVENTORY.GET_ADD_PRODUCT_MERCHANDISE(productid))}>Add Merchandise</button>
    
                    <button disabled={del.loading} onClick={async (e)=>{
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
                <h2><span>Quantity/U:</span> <UnitShow customunits={product.customUnits} unitval={{value: product.unitQuantity,unit: product.unit}} /></h2>  
                <h2><span>Available In Stock:</span> <UnitShow customunits={product.customUnits}  unitval={{value: product.stockQuantity,unit: product.unit}} /></h2>
                {product.customUnits &&  <h2><span>Units:</span><div>
                    {product.customUnits?.map((unit,key)=><div style={{margin: "10px"}} key={key}>{unit.name} Is <UnitShow customunits={product.customUnits}  unitval={{value: unit.ratio,unit: product.unit}}/></div>)}
                </div></h2>}
                <div>
                {/*<form onSubmit={handleSubmit(async (data)=>{
                    const sendata = {
                        used: data.used = data.used.value * (data.used.unit.subunit ? data.used.unit.subunit.ratio : 1),
                        wasted:  data.wasted.value * (data.wasted.unit.subunit ? data.wasted.unit.subunit.ratio : 1)  
                    }
                    console.log("SUBMIT !!!",sendata)
    
                    await consume.mutate(sendata)
                    usenav(0)
                })}>
                    <div className="input-item">
                        <div>
                            <label htmlFor="use">Use</label>
                            <UnitValue inputcustomprops={{placeholder:"Use...", className:"secondary-input" ,id:"use"}}  
                            register={register}  
                            name="used" 
                            control={control} 
                            defaultValue={{value: 0,units: product.unit}} 
                            units={allunits.filter((un)=>un.id === product.unit.id)} />
                        </div>
                        <div >    
                            <label htmlFor="waste">Waste</label>
                            <UnitValue  inputcustomprops={{placeholder:"Use...", className:"secondary-input" ,id:"use"}}
                              register={register}  
                              name="wasted" 
                              control={control} 
                              defaultValue={{value: 0,units: product.unit}} 
                              units={allunits.filter((un)=>un.id === product.unit.id)} />
                        </div>
                        <button type="submit" disabled={consume.loading} >Update</button>  
                    </div>
                </form>
                {errors && errors["wasted"] && <p className="error">{errors["wasted"].message.replaceAll('"',"")}</p>}
                {errors && errors["used"] && <p className="error">{errors["used"].message.replaceAll('"',"")}</p>}*/}
                </div>
            </div>
        </motion.div >
        <motion.div variants={FadeIn()} className="data-review">
            <div className="data-review-header">
                <h1><span>Template:</span> {product.template?.name} </h1>
                <div >
                    {getLevel(user.profile.permissions.tables) >= getLevel("manage") && <><button onClick={(e)=>{
                        usenav(ROUTES.INVENTORY.TEMPLATES.GET_ADD_UPDATE_TEMPLATE(productid))
                    }}>{product.template ? " Update Template" : " New Template" }</button>
                   
                    <button style={{display : !product.template ? "none" : "inline-block"}} type="button" onClick={async (e)=>{
                        await removetemplate.remove()
                    }} >Delete</button>
                     </>}
                </div>
            </div>
            <div className="data-review-body secondary-form">
                <form style={{margin: "0px",padding: "0px"}} action="none">  
                    {product.template?.notes && <p style={{margin: "10px 5px"}}><span>{product.template?.notes}</span></p>}              
                    {product.template && <TemplatePreview showpreview={false} custom_fields={product.template?.custom_fields}   />}
                </form>
            </div>
        </motion.div>
        <MerchandiseTable  title={'Related Merchandise'} parentid={productid}  />
    
        </>            
    
}
const ReviewProduct = ()=>{
    const {productid} = useParams()
    return <ReviewProductUi productid={productid} />        
}

export default ReviewProduct