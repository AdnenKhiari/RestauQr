import ProductTemplateDetails from "../../components/ProductTemplatesInfo.jsx"
import { useParams } from "react-router-dom"
import Loading from "../../components/Loading"
import Error from "../../components/Error"
import { GetProductTemplateById } from "../../lib/ProductTemplates"
import { useState } from "react"

const UpdateProductTemplate = ()=>{
    const {productid,templateid} = useParams()
    const {result,error,loading} = GetProductTemplateById(productid,templateid)
    console.log(result,error,loading)
    if(loading)
        return <Loading  />
    if(error)
        return <Error err={error} msg='Invalid Product Template ID' />
    return <ProductTemplateDetails defaultVals={result} />
}

export default UpdateProductTemplate