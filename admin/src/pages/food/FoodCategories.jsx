import { useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import joi from "joi"
import {joiResolver} from "@hookform/resolvers/joi"
import GetCategories from "../../lib/GetCategories"
import UpdateCategories from "../../lib/UpdateCategories.jsx"

import Error from "../../components/Error"
import Loading from "../../components/Loading"
import { useEffect } from "react"

const schema = joi.object({
    categories: joi.array().items(joi.string().trim())
})
const FoodCategories = ()=>{

    const {result,loading,error} = GetCategories()

    if(error)
        return <Error msg={"An Error Has occured While Fetching Categories"} error={error}  />
    if(loading)
        return <Loading />

    return <CategoriesForm cats={result} />
}
const CategoriesForm = ({cats})=>{

    const {mutate,loading : mutateLoading,error : mutateError} = UpdateCategories()

    const formOptions = useForm({
        defaultValues: {categories: cats},
        shouldUnregister: false,
        resolver: joiResolver(schema)
    })

    const {watch,setValue,handleSubmit,reset,register,control,formState : {errors}} = formOptions
    const {append,remove} = useFieldArray({
        name: 'categories',
        control: control
    })  

    const submit = (data)=>{
        console.log(data)
        mutate(data.categories)
    }

    return <form onReset={(e)=>{e.preventDefault();reset()}} onSubmit={handleSubmit(submit)} className="food-categories-container">
    <div className="food-categories-header">
        <h1>Categories</h1>
        <button onClick={(e)=>append('')}>New Category</button>
    </div>
    <div className="food-categories-body">
        {watch('categories').map((item,index)=><p className={errors.categories && errors.categories[index] ?  "input-error": undefined} key={index}>
            <input placeholder="Category..."  type="text" {...register(`categories.${index}`)} />  
            <img src="/trash.png" alt="trahs" onClick={(e)=>remove(index)}/> 
            </p>)}
    </div>
    <div>   
        <button type="reset" >Reset</button>
        <button type="submit">Update</button>
    </div>
</form>
}
export default FoodCategories