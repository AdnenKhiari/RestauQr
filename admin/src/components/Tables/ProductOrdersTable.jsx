import {getFirestore,onSnapshot,collection,query,where,limit,startAfter,orderBy,documentId, FieldPath, getDocs} from "firebase/firestore"

import * as ROUTES from "../../ROUTES"
import { useNavigate } from "react-router-dom"
import PaginatedUniversalTable from "../UniversalTable/PaginatedUniversalTable"
import joi from "joi"
import { formatFbDate } from "../../lib/utils"

const schema  = joi.object({
    name: joi.string().allow('').required().label("Item Name"),
    higherexpiresIn: joi.date().allow('').required().label('Expires In : min'),
    lowerexpiresIn: joi.date().allow('').required().label('Expires In : max'),
    highertime: joi.date().allow('').required().label('Purshase Time : min'),
    lowertime: joi.date().allow('').required().label('Purshase Time : max')
})

const ProductOrdersTable = ({queryConstraints,title,parentid})=>{

    const page_lim = 10
    const path = (parentid ? 'products/' + parentid+'/'  : '') + 'product_orders' 
    const rows = [
    {
        Header: 'Order Id',
        accessor: 'id'
    },    
    {
        Header: 'Product Id',
        accessor: 'product_id'
    },        
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
        accessor: 'time'
    },
    {
        Header: 'Expires In',
        accessor: 'expiresIn'
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
        if(col.docs.length > 0){
            const alldata = col.docs.map((item)=>{
                return {...item.data(),id: item.id,product_id: parentid ? parentid : item.ref.parent.parent.id}
            })
            res = alldata
        }
        return res
    }

    const filterData = (searchdata,cst)=>{
        
        if(searchdata.name){
            cst.push(where('name','>=',searchdata.name))
            cst.push(orderBy('name'))
        }

        if(searchdata.higherexpiresIn){
            cst.push(where('expiresIn','>=',searchdata.higherexpiresIn))
        }
        if(searchdata.lowerexpiresIn){
            cst.push(where('expiresIn','<=',searchdata.lowerexpiresIn))
        }


        if(searchdata.lowerexpiresIn || searchdata.higherexpiresIn)
            cst.push(orderBy('expiresIn'))

        //expires In
        if(searchdata.highertime){
            cst.push(where('time','>=',searchdata.highertime))
        }
        if(searchdata.lowertime){
            cst.push(where('time','<=',searchdata.lowertime))
        }

        return null
    }

    const usenav = useNavigate()
    return <PaginatedUniversalTable 
    colname={path}
    pagname="time" 
    rows={rows}  
    title={title} 
    filterData={filterData} 
    onDataQueried={onDataQueried} 
    onDataSubmit={customOptions.submit} 
    structure={customOptions.structure}   
    subscribe={false} 
    group={!parentid}
    schema={schema}
    hide={[0,1]}
    queryConstraints={queryConstraints}
    oncl = {(row)=>usenav(ROUTES.INVENTORY.GET_REVIEW_PRODUCT_ORDER(row.product_id,row.id))}
    page_lim= {page_lim}        />
}
export default ProductOrdersTable

