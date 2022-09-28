import { useNavigate, useParams } from "react-router-dom"
import {GetSupplierById,RemoveSupplierById} from "../../lib/SuppliersDal"
import Loading from "../../components/Loading"
import Error from "../../components/Error"
import * as ROUTES from "../../ROUTES"
import { useContext, useEffect, useMemo, useState } from "react"
import { UserContext } from "../../contexts"
import {motion} from "framer-motion"
import { FadeIn } from "../../animations"
import {useTable,useSortBy} from "react-table"
import { getLevel } from "../../lib/utils"

import uploadimg from "../../images/upload.png"
import checkboximg from "../../images/checkbox.png"
import radiobuttonimg from "../../images/radio-button.png"
import radioimg from "../../images/radio.png"
import phoneimg from "../../images/phone.png"
import noimage from "../../images/no-photo.png"
import addressimg from "../../images/address.png"

const ReviewSupplier =()=>{
    const {supplierid} = useParams()
    const {result : supplier,loading,error} = GetSupplierById(supplierid)
    const supplierremover = RemoveSupplierById(supplierid)
    const user = useContext(UserContext)
    const usenav = useNavigate()
    if( error)
        return <Error msg={"Error while retrieving Supplier information " + supplierid} error={error} />
    if( loading)
        return <Loading />
    return  <>
    {/*<h1 className="data-review-id">#{foodid}</h1>*/}
    <motion.div variants={FadeIn()} className="data-review">
        <div className="data-review-header">
            <h1><span>{supplier.name}</span></h1>
            <div>
                {getLevel(user.profile.permissions.food)>=  getLevel("manage") && <><button onClick={(e)=>{
                    usenav(ROUTES.SUPPLIERS.GET_UPDATE_SUPPLIER(supplier.id))
                }}>Update</button>
                <button onClick={async (e)=>{
                    try{
                        await supplierremover.remove(supplier.id)
                        usenav(ROUTES.SUPPLIERS.ALL)
                    }catch(err){
                        console.log(err)
                    }
                }}>Delete</button></>}
            </div>
        </div>
        <div className="data-review-body">
            {<img  style={{width: "400px",height:"400px",border: supplier.logo ? undefined : "none",float:"right"}} src={supplier.logo || noimage} alt="" />}
            <h2><span>Email:</span>  </h2>
            <h2>{supplier.email}</h2>            
            {supplier.website && <><h2><span>Website:</span></h2>
            <h2><a target="_blank" rel="noreferrer" href={supplier.website}>{supplier.website}</a></h2></>}
            <h2><span>Phone Numbers:</span></h2>
            <div className="ticket-container column">
                {supplier.phonenumbers && supplier.phonenumbers.map((sup,key)=><h2 key={key} >
                    <img className="make-img-blue" src={phoneimg} alt="phone" />
                    <p>{sup}</p>
                </h2>)}
            </div>
            <h2><span>Addresses:</span></h2>
            <div className="ticket-container column">
                {supplier.addresses && supplier.addresses.map((sup,key)=><h2 key={key} >
                    <img className="make-img-blue" src={addressimg} alt="phone" />
                    <p> {sup}</p>
                </h2>)}
            </div>
            <h2><span>Products:</span></h2>
            <div className="ticket-container">
                {supplier.products && supplier.products.map((prod,key)=><div style={{cursor: "pointer"}} className="ticket" onClick={(e)=>window.open(ROUTES.INVENTORY.GET_REVIEW_PRODUCT(prod.id))} key={key} >
                    <h2 > {prod.name}</h2>
                </div>)}
            </div>    
        </div>
    </motion.div >
    </>
}

export default ReviewSupplier