import {FormProvider, useFieldArray, useForm, useFormContext, useWatch} from "react-hook-form"
import {AddUpdateSupplier} from "../lib/SuppliersDal"
import {GetUnits} from "../lib/Units"
import {useNavigate} from "react-router-dom"
import * as ROUTES from "../ROUTES"
import DropDown from "react-dropdown"
import{joiResolver} from "@hookform/resolvers/joi"
import { fileListExtension } from 'joi-filelist';

import BaseJoi from "joi"
import Loading from "./Loading"
import Error from "./Error"
import { FadeIn } from "../animations"
import {motion} from "framer-motion"
import Select from "react-select"
import { useEffect } from "react"
import CustomSelect from "./Custom/CustomSelect"
import FormSelect from "./Custom/FormSelect"
import UnitValue from "./Custom/UnitValue"

import UnitSelect from "./Custom/UnitSelect"
import ProductTable from "./Tables/ProductsTable"
import addimage from "../images/addimage.png"

import plusimage from "../images/plus.png"
import trashimg from "../images/trash.png"
import { useSortBy, useTable } from "react-table"
import { useMemo } from "react"
import {AddUpdateProductOrders} from "../lib/ProductOrdersDal"
import uploadimg from "../images/upload.png"


const joi  =  fileListExtension(BaseJoi)  
const schema = joi.object({
    id: joi.string().optional().label('Order Id'),
    expected_delivery_date: joi.date().required().label('Expected Date'),
    notes: joi.string().label("Notes"),
    orders: joi.array().items(joi.object({
        name: joi.string().required(),
        product: joi.string().required(),
        units: joi.number().required(),
        priceperunit :  joi.number().required(),
    })).required()
})

const ProductOrderInfo = ({defaultVals = undefined,supplierinfo})=>{
    //const {result: allunits,error: errunits,loading: unitloading} = GetUnits()
    const formOptions = useForm({
       defaultValues: defaultVals ? {
        id: defaultVals.id,
        orders: defaultVals.orders,
        } : {orders: []},
        resolver: joiResolver(schema)
    })
    const {handleSubmit,register,setValue,watch,reset,formState : {errors}} = formOptions
    const productordersmutator = AddUpdateProductOrders(!defaultVals)
    const usenav = useNavigate() 
    console.log(errors)
    const SubmitForm = async (data)=>{
        
        console.log(data)
        return;
        try{
            console.log("D",data)   
            data.logo = ""
            const suborderid  = await productordersmutator.mutate(data)
            console.log(suborderid)

            if(productordersmutator.error)
                throw productordersmutator.error
              
            // normalement usenav to the new id
            usenav(ROUTES.PRODUCT_ORDERS.GET_PRODUCT_ORDERS_BY_ID(suborderid))
            
        }catch(err){
            console.error(err)
        }
    }
    return <motion.div variants={FadeIn()} className="secondary-form">
        <h1>{defaultVals ? "Update Products Orders : " :"Add Products Orders   " } </h1>
        <FormProvider {...formOptions}>
            <form onReset={(e)=>{e.preventDefault();reset()}} onSubmit={handleSubmit(SubmitForm)}>  
            <div className="input-item">
                <label htmlFor="expected_delivery_date"><h2>Expected Delivery Date : </h2></label>
                <input className={"secondary-input " + (errors.expected_delivery_date ? 'input-error' : '')} type="date" id="expected_delivery_date" {...register("expected_delivery_date")} />
            </div>   
            <div className="input-item">
                <textarea className={(errors.notes ? 'input-error' : '')} placeholder="Notes Here ..." id="notes" cols="30" rows="10"{...register("notes")}></textarea>
            </div>   
 
            <OrdersTable defaultVals={defaultVals} supplierinfo={supplierinfo} />
            {errors && <p className="error">{"Make Sure the data is valid !"}</p>}

            <div className="validate">
                <button type={"reset"}>Reset</button>
                <button disabled={productordersmutator.loading} type="submit">{defaultVals ? "Update" : "Add"}</button>
            </div>
            </form>
        </FormProvider>
    </motion.div>
}

const OrdersTable = ({supplierinfo,defaultVals})=>{
    const {watch,register,control} = useFormContext()
    const {append,remove} = useFieldArray({
        name: "orders"
    })
    const orders = watch("orders") || []
    const columns = useMemo(()=>{
        return [{
            Header: 'Name',
            accessor: 'name',
            Cell: (val)=> <input style={{width: "100%"}}  className={"secondary-input "} type="text" {...register(`orders.${val.row.index}.name`)} />
          
        },
        {
            Header: 'Product',
            accessor: 'product',
            Cell: (val)=><>
            <FormSelect options={supplierinfo.products.map((item)=>({value: item.id,label: item.name}))} defaultValue={{value: ""}} name={`orders.${val.row.index}.product`} control={control} />
            </>
        },
        {
            Header: 'Units',
            accessor: 'units',
            Cell: (val)=> <input  className={"secondary-input "} type="number" {...register(`orders.${val.row.index}.units`)} />

        },
        {
            Header: 'Price/U',
            accessor: 'priceperunit',
            Cell: (val)=> <input  className={"secondary-input "} type="number" {...register(`orders.${val.row.index}.priceperunit`)} />
        },
        /*{
            Header: 'Quantity/U',
            accessor: 'quantityperunit',
            Cell: (val)=>  <UnitValue  inputcustomprops={{className:"secondary-input" ,id:"unitQuantity"}}
            register={register}  
            name={`orders.${val.row.index}.priceperunit`}
            control={control}     
            defaultValue={{value:  defaultVals ? defaultVals.orders[val.row.index].unitQuantity: 0,units: product.unit}} 
            units={allunits.filter((un)=>un.id === product.unit.id)} />  
        },*/
        {
            Header: 'Total',
            Cell: ({row})=><h3 style={{fontWeight: "600"}}>{row.original.units * row.original.priceperunit}</h3>
        },
        {
            Header: 'Status',
            Cell: ({row})=><h3>Delivered</h3>
        },
        {
            Header: 'Action',
            Cell: (val)=>{
                return<>
                <button onClick={(e)=>console.log("Confime")} >Link Merchandise</button>
                <button onClick={(e)=>console.log("Confime")} >Update Status</button>
                <h3><button onClick={(e)=>remove(val.row.index)} >Remove</button></h3>
                </> 
            }
        }
       ]
    },[])

    const usenav = useNavigate()
    const tb = useTable({columns: columns,data: orders })

    return orders &&<>
     <div className="secondary-table">
        <table {...tb.getTableProps()}>
            <thead>
                {tb.headerGroups.map((HeaderGroup)=><tr  {...HeaderGroup.getHeaderGroupProps()}>
                    {HeaderGroup.headers.map((col)=><th  {...col.getHeaderProps()}>
                        <div className="header-tag">
                            {col.render("Header")}
                            {col.isSortedDesc !== undefined && (col.isSortedDesc ? <img style={{transform: "rotate(180deg)"}} src={uploadimg} alt="uparrow" /> : <img  src={uploadimg} alt="uparrow" />) }
                        </div>
                    </th>)}
                </tr>)}
            </thead>
            <tbody {...tb.getTableBodyProps()}>
                {tb.rows.map((row,rowind)=>{
                    tb.prepareRow(row)
                    return <tr style={{backgroundColor:"white"}} className="review-row" /*onClick={(e)=>usenav(ROUTES.INVENTORY.GET_REVIEW_PRODUCT(row.original.id))}*/ {...row.getRowProps()}>
                        {row.cells.map((cell,index)=>{
                            return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                        })}
                    </tr>
                })}
                <tr><td></td><td></td><td></td><td></td><td>
                  <h3><span>Total Price : {tb.data.reduce((prev,row)=>prev + row.units * row.priceperunit,0)}</span></h3>  
                </td>
                <td>
                <button onClick={(e)=>{append({units:0,name:"",product:"",priceperunit: 0})}} type="button" className="input">Add</button> 
                <button style={{width:"0px","padding":0}}></button>
                </td>
                </tr>
            </tbody>
        </table>
    </div>
    </>
}

export default ProductOrderInfo