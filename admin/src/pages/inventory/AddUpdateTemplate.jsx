import ProductTemplateDetails from "../../components/ProductTemplatesInfo.jsx"
import { useParams } from "react-router-dom"
import Loading from "../../components/Loading"
import Error from "../../components/Error"
import { useState } from "react"
import { GetProductById } from "../../lib/ProductsDal.jsx"

const AddUpdateProductTemplate = ()=>{
    const {productid} = useParams()
    const {result,error,loading} = GetProductById(productid)
    console.log(result,error,loading)
    if(loading)
        return <Loading  />
    if(error)
        return <Error err={error} msg='Invalid Product ID' />
    console.debug(result)
    return <ProductTemplateDetails defaultVals={result?.template} />
}

export default AddUpdateProductTemplate