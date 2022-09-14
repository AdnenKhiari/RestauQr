import {getFirestore,onSnapshot,collection,query,where,limit,startAfter,orderBy,documentId, FieldPath} from "firebase/firestore"
import UnitShow from "../Custom/UnitShow"
import * as ROUTES from "../../ROUTES"
import { useNavigate } from "react-router-dom"
import PaginatedUniversalTable from "../UniversalTable/PaginatedUniversalTable"
import joi from "joi"
import * as APIROUTES from "../../APIROUTES"

const schema  = joi.object({
    address: joi.number().allow('').required().label("Address"),
    phoneNumber: joi.number().allow('').required().label("Phone Number"),
    name: joi.string().allow('').required().label("Supplier Name"),
})

const SuppliersTables = ({queryConstraints,title,oncl = undefined})=>{

    const page_lim = 10

    const rows = [
    {
        Header: 'Supplier Name',
        accessor: 'name',
    },{
        Header: 'Address',
        accessor: 'addresses',
        Cell : ({value})=> value[0] || ""
    },
    {
        Header: 'Phone Number',
        accessor: 'phonenumbers',
        Cell : ({value})=> value[0] || ""

    }]



    const customOptions = {
        submit :  (data)=>{
            console.log(data)
        },
        structure: [
        {
            type: "text",
            name: 'name',
            label: 'Supplier Name'
        },
        {
            type: "text",
            name: 'phoneNumber',
            label: 'Phone Number'
        },
        {
            type: "text",
            name: 'address',
            label: 'Address'
        } 
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

    const defaultCl = (row)=>usenav(ROUTES.SUPPLIERS.GET_SUPPLIER(row.id))


    const usenav = useNavigate()
    return <PaginatedUniversalTable 
    colname={'suppliers'}
    pagname="name" 
    rows={rows}  
    title={title} 
    cs_query={APIROUTES.SUPPLIERS.GET_SUPPLIERS} 
    onDataQueried={onDataQueried} 
    onDataSubmit={customOptions.submit} 
    structure={customOptions.structure}   
    subscribe={false} 
    schema={schema}
    queryConstraints={queryConstraints}
    oncl={oncl ? oncl : defaultCl}
    page_lim= {page_lim}        />
}
export default SuppliersTables