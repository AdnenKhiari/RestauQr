import {getFirestore,onSnapshot,collection,query,where,limit,startAfter,orderBy,documentId, FieldPath} from "firebase/firestore"
import { useCallback, useState } from "react"
import { useEffect } from "react"
import moment from "moment"
import {formatFbDate, map_status_to_priority} from "../lib/utils"
import * as ROUTES from "../ROUTES"
import { useNavigate } from "react-router-dom"
import PaginatedUniversalTable from "./UniversalTable/PaginatedUniversalTable"
import joi from "joi"

const schema  = joi.object({
    highersellingUnitPrice: joi.number().allow('').required().label("Price/U: min"),
    lowersellingUnitPrice: joi.number().allow('').required().label("Price/U: max"),

    higherunitQuantity: joi.number().allow('').required().label("Quantity/U: min"),
    lowerunitQuantity: joi.number().allow('').required().label("Quantity/U: max"),

    higherstockQuantity: joi.number().allow('').required().label("Available Stock: min"),
    lowerstockQuantity: joi.number().allow('').required().label("Available Stock: max"),

    name: joi.string().allow('').required().label("Product Name"),
})

const ProductsTables = ({queryConstraints,title})=>{

    const page_lim = 10

    const rows = ['Product Name','Price/U','Quantity/U','Available','Unit']
    const customOptions = {
        submit :  (data)=>{
            console.log(data)
        },
        structure: [
        {
            type: "text",
            name: 'name',
            label: 'Product Name'
        },
        {
            type: "number",
            name: 'highersellingUnitPrice',
            label: 'Price/U : min'
        },
        {
            type: "number",
            name: 'lowersellingUnitPrice',
            label: 'Price/U : max'
        },
        {
            type: "number",
            name: 'higherunitQuantity',
            label: 'Quantity/U : min'
        },     
        {
            type: "number",
            name: 'lowerunitQuantity',
            label: 'Quantity/U: max'
        },  
        {
            type: "number",
            name: 'higherstockQuantity',
            label: 'Available Stock: min'
        }, 
        {
            type: "number",
            name: 'lowerstockQuantity',
            label: 'Available Stock: max'
        }, 
        ]

    }

    const onDataQueried = (col)=>{
        let res = []
        if(col.docs.length > 0){
            const alldata = col.docs.map((item)=>{
                return {...item.data(),id: item.id}
            })
            res = alldata.map((dt)=> [
                dt.id,  
                dt.name,
                dt.sellingUnitPrice,
                dt.unitQuantity,
                dt.stockQuantity,
                dt.unit
            ])
        }
        return res
    }

    const filterData = (searchdata,cst)=>{
        
        if(searchdata.name){
            cst.push(where('name','>=',searchdata.name))
            cst.push(orderBy('name'))
        }

        if(searchdata.higherstockQuantity){
            cst.push(where('stockQuantity','>=',searchdata.higherstockQuantity))
        }
        if(searchdata.lowerstockQuantity){
            cst.push(where('stockQuantity','<=',searchdata.lowerstockQuantity))
        }

        //unit quantity
        if(searchdata.higherunitQuantity){
            cst.push(where('unitQuantity','>=',searchdata.higherunitQuantity))
        }
        if(searchdata.lowerunitQuantity){
            cst.push(where('unitQuantity','<=',searchdata.lowerunitQuantity))
        }

        if(searchdata.lowerunitQuantity || searchdata.higherunitQuantity)
        cst.push(orderBy('unitQuantity'))

        //selling unit price
        if(searchdata.highersellingUnitPrice){
            cst.push(where('sellingUnitPrice','>=',searchdata.highersellingUnitPrice))
        }
        if(searchdata.lowersellingUnitPrice){
            cst.push(where('sellingUnitPrice','<=',searchdata.lowersellingUnitPrice))
        }

        if(searchdata.lowersellingUnitPrice || searchdata.highersellingUnitPrice)
            cst.push(orderBy('sellingUnitPrice'))


        return null
    }

    const usenav = useNavigate()
    return <PaginatedUniversalTable 
    colname={'products'}
    pagname="stockQuantity" 
    rows={rows}  
    title={title} 
    filterData={filterData} 
    onDataQueried={onDataQueried} 
    onDataSubmit={customOptions.submit} 
    structure={customOptions.structure}   
    subscribe={false} 
    schema={schema}
    hide={[0]}
    queryConstraints={queryConstraints}
    oncl = {(row)=>usenav(ROUTES.INVENTORY.GET_REVIEW_PRODUCT(row[0]))}
    page_lim= {page_lim}        />
}
export default ProductsTables