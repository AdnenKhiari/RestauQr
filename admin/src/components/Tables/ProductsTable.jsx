import {getFirestore,onSnapshot,collection,query,where,limit,startAfter,orderBy,documentId, FieldPath} from "firebase/firestore"
import UnitShow from "../Custom/UnitShow"
import * as ROUTES from "../../ROUTES"
import { useNavigate } from "react-router-dom"
import PaginatedUniversalTable from "../UniversalTable/PaginatedUniversalTable"
import joi from "joi"
import * as APIROUTES from "../../APIROUTES"

const schema  = joi.object({
    highersellingUnitPrice: joi.number().allow('').required().label("Price/U: min"),
    lowersellingUnitPrice: joi.number().allow('').required().label("Price/U: max"),

    higherunitQuantity: joi.number().allow('').required().label("Quantity/U: min"),
    lowerunitQuantity: joi.number().allow('').required().label("Quantity/U: max"),

    higherstockQuantity: joi.number().allow('').required().label("Available Stock: min"),
    lowerstockQuantity: joi.number().allow('').required().label("Available Stock: max"),

    name: joi.string().allow('').required().label("Product Name"),
})

const ProductsTables = ({queryConstraints,title,oncl = undefined})=>{

    const page_lim = 10

    const rows = [
    {
        Header: 'Product Name',
        accessor: 'name'
    },{
        Header: 'Price/U',
        accessor: 'sellingUnitPrice'
    },
    {
        Header: 'Quantity/U',
        accessor: 'unitQuantity',
        Cell: ({row}) => <UnitShow unitval={{value: row.original.unitQuantity,unit: row.original.unit}} />
    },    
    {
        Header: 'Available Quantity',
        accessor: 'stockQuantity',
        Cell: ({row}) => <UnitShow unitval={{value: row.original.stockQuantity,unit: row.original.unit}} />
    }]



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
        if(col.length > 0){
            res = col.map((item)=>{
                return {...item,id: item.id}
            })
        }
        return res
    }

    const defaultCl = (row)=>usenav(ROUTES.INVENTORY.GET_REVIEW_PRODUCT(row.id))


    const usenav = useNavigate()
    return <PaginatedUniversalTable 
    colname={'products'}
    pagname="stockQuantity" 
    rows={rows}  
    title={title} 
    cs_query={APIROUTES.PRODUCTS.GET_PRODUCTS} 
    onDataQueried={onDataQueried} 
    onDataSubmit={customOptions.submit} 
    structure={customOptions.structure}   
    subscribe={false} 
    schema={schema}
    queryConstraints={queryConstraints}
    oncl={oncl ? oncl : defaultCl}
    page_lim= {page_lim}        />
}
export default ProductsTables