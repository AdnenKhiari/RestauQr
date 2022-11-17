import {getFirestore,onSnapshot,collection,query,where,limit,startAfter,orderBy,documentId, FieldPath} from "firebase/firestore"
import UnitShow from "../Custom/UnitShow"
import * as ROUTES from "../../ROUTES"
import { useNavigate } from "react-router-dom"
import PaginatedUniversalTable from "../UniversalTable/PaginatedUniversalTable"
import joi from "joi"
import * as APIROUTES from "../../APIROUTES"
import { formatFbDate } from "../../lib/utils"
import { useState } from "react"
import PopupItem from "../PopupItem"

/*const schema  = joi.object({
    address: joi.number().allow('').required().label("Address"),
    phoneNumber: joi.number().allow('').required().label("Phone Number"),
    name: joi.string().allow('').required().label("Supplier Name"),
})
*/
const schema = joi.any()
const ProductOrdersTable = ({queryConstraints,title,oncl = undefined,parentid})=>{

    const [popUpOpen,setPopUpOpen] = useState(false)
    const [popUpDetails,setPopUpDetails] = useState(null)


    const page_lim = 10

    const rows = [
    {
        Header: 'Creation Date',
        accessor: 'creation_date',
        Cell : ({value})=> formatFbDate(value,true)
    },
    {
        Header: 'Delivery Date',
        accessor: 'expected_delivery_date',
        Cell : ({value})=> formatFbDate(value,true)
    },
    {
        Header: 'Notes',
        accessor: 'notes',
        Cell: ({value}) => <p style={{height: "100%",fontWeight: "inherit"}} onClick={(e)=>{
            e.stopPropagation()
            setPopUpOpen(true)
            setPopUpDetails({notes: value})
        }}>{value.slice(0,150) + (value.length > 40 ? "..." : "")}</p> 
    }]

    const customOptions = {
        submit :  (data)=>{
            console.log(data)
        },
        structure: [
        {
            type: "datetime-local",
            name: 'expected_delivery_date',
            label: 'Delivery Date'
        },
        {
            type: "datetime-local",
            name: 'creation_date',
            label: 'Creation Date'
        },
        ]

    }

    const onDataQueried = (col)=>{
        let res = []
        if(col.length > 0){
            res = col.map((item)=>{
                return {...item,id: item.id}
            })
        }
        return res
    }

    const defaultCl = (row)=>usenav(ROUTES.PRODUCT_ORDERS.GET_PRODUCT_ORDERS_BY_ID(row.supplierid,row.id))


    const usenav = useNavigate()
    return <>
    <PopupItem open={popUpOpen} onClose={(e)=>setPopUpOpen(false)} >
        {(close) => <div className="data-review">
            <div className="data-review-header">
                <h1>Notes :</h1>
            </div>
            <div className="data-review-body">
                <p>{popUpDetails?.notes}</p>
            </div>
        </div>}
    </PopupItem>
    <PaginatedUniversalTable 
    rows={rows}  
    title={title} 
    group={true}
    cs_query={parentid ? APIROUTES.PRODUCT_ORDERS.GET_PRODUCT_ORDERS_OF_SUPPLIER(parentid) : APIROUTES.PRODUCT_ORDERS.GET_PRODUCT_ORDERS} 
    onDataQueried={onDataQueried} 
    onDataSubmit={customOptions.submit} 
    structure={customOptions.structure}   
    schema={schema}
    custom_key="lastorderRef"
    custom_val="supplier_ref"
    queryConstraints={queryConstraints}
    oncl={oncl ? oncl : defaultCl}
    page_lim= {page_lim}   
    colors={(table_data)=> "suborder_status " + table_data.status.toLowerCase()}
    /></>
}
export default ProductOrdersTable