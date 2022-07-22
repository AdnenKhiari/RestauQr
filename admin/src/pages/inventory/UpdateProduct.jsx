import ProductsDetails from "../../components/ProductsInfo"
import { useParams } from "react-router-dom"
import Loading from "../../components/Loading"
import Error from "../../components/Error"
import { GetProductById } from "../../lib/ProductsDal"
import { useState } from "react"
import { addDoc, collection, doc, getFirestore, setDoc } from "firebase/firestore"

const UpdateProduct = ()=>{
    const {productid} = useParams()
    const {result,error,loading} = GetProductById(productid)
    console.log(result,error,loading)
    if(loading)
        return <Loading  />
    if(error)
        return <Error err={error} msg='Invalid Productid ID' />
    return <ProductsDetails defaultVals={result} />
}

export default UpdateProduct