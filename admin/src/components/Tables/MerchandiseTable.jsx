import {getFirestore,onSnapshot,collection,query,where,limit,startAfter,orderBy,documentId, FieldPath, getDocs} from "firebase/firestore"

import * as ROUTES from "../../ROUTES"
import { useNavigate } from "react-router-dom"
import PaginatedUniversalTable from "../UniversalTable/PaginatedUniversalTable"
import joi from "joi"
import { formatFbDate } from "../../lib/utils"
import * as APIROUTES from "../../APIROUTES"

const schema  = joi.object({
    name: joi.string().allow('').required().label("Item Name"),
    higherexpiresIn: joi.date().allow('').required().label('Expires In : min'),
    lowerexpiresIn: joi.date().allow('').required().label('Expires In : max'),
    highertime: joi.date().allow('').required().label('Purshase Time : min'),
    lowertime: joi.date().allow('').required().label('Purshase Time : max')
})

const MerchandiseTable = ({queryConstraints,title,parentid})=>{

    const page_lim = 10
    const path = (parentid ? 'products/' + parentid+'/'  : '') + 'product_instances' 
    const rows = [      
    {
        Header: 'Item Name',
        accessor: 'name'
    },
    {
        Header: 'Product Quantity',
        accessor: 'productQuantity'
    },
    {
        Header: 'Purshase Time',
        accessor: 'time',
        Cell : ({value})=> formatFbDate(value,true)
    },
    {
        Header: 'Expires In',
        accessor: 'expiresIn',
        Cell : ({value})=> formatFbDate(value,true)
    },
    {
        Header: 'Used',
        accessor: 'used'
    },
    {
        Header: 'Wasted',
        accessor: 'wasted'
    },]
    //const rows = ['Item Name','Item Quantity','Unit Quantity','Used','Purshase Time','Expires In']
    const customOptions = {
        submit :  (data)=>{
            console.log(data)
        },
        structure: [
        {
            type: "text",
            name: 'name',
            label: 'Item Name'
        },
        {
            type: "date",
            name: 'higherexpiresIn',
            label: 'Expires In : min'
        },
        {
            type: "date",
            name: 'lowerexpiresIn',
            label: 'Expires In : max'
        },
        {
            type: "date",
            name: 'highertime',
            label: 'Purshase Time : min'
        },
        {
            type: "date",
            name: 'lowertime',
            label: 'Purshase Time : max'
        }
        ]
    }

    const onDataQueried = (col)=>{
        let res = []
        if(col.length > 0){
            const alldata = col.map((item)=>{
                return {...item,id: item.id,product_id: parentid ? parentid : item.product_ref}
            })
            res = alldata
            console.log(alldata)
        }
        return res
    }


    const usenav = useNavigate()
    return <PaginatedUniversalTable 
    colname={path}
    pagname="time" 
    rows={rows}  
    title={title} 
    custom_key="lastProductRef"
    custom_val="product_ref"
    cs_query={parentid ? APIROUTES.PRODUCTS.MERCHANDISE.GET_MERCHANDISE_OF_PRODUCT(parentid) :  APIROUTES.PRODUCTS.MERCHANDISE.GET_MERCHANDISE}
    onDataQueried={onDataQueried} 
    onDataSubmit={customOptions.submit} 
    structure={customOptions.structure}   
    subscribe={false} 
    group={!parentid}
    schema={schema}
    queryConstraints={queryConstraints}
    oncl = {(row)=>usenav(ROUTES.INVENTORY.GET_REVIEW_PRODUCT_MERCHANDISE(row.product_id,row.id))}
    page_lim= {page_lim}        />
}
export default MerchandiseTable

