import { useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import joi from "joi"
import {joiResolver} from "@hookform/resolvers/joi"
import {UpdateCategories,GetCategories} from "../../lib/Options"

import Error from "../../components/Error"
import Loading from "../../components/Loading"
import { useEffect } from "react"
import { useContext } from "react"
import { UserContext } from "../../contexts"
import { FadeIn } from "../../animations"
import {motion} from "framer-motion"

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
    const user = useContext(UserContext)
    const {watch,setValue,handleSubmit,reset,register,control,formState : {errors}} = formOptions
    const {append,remove} = useFieldArray({
        name: 'categories',
        control: control
    })  

    const submit = (data)=>{
        console.log(data)
        mutate(data.categories)
    }

    return <motion.form variants={FadeIn()} onReset={(e)=>{e.preventDefault();reset()}} onSubmit={handleSubmit(submit)} className="food-categories-container">
    <div className="food-categories-header">
        <h1>Categories</h1>
       {user.profile.permissions.categories.manage &&  <button onClick={(e)=>append('')}>New Category</button>}    
    </div>
    <div className="food-categories-body">
        {watch('categories').map((item,index)=><p className={errors.categories && errors.categories[index] ?  "input-error": undefined} key={index}>
            <input placeholder="Category..."  type="text" {...register(`categories.${index}`)} />  
           {user.profile.permissions.categories.manage && <img src="/trash.png" alt="trahs" onClick={(e)=>remove(index)}/>} 
            </p>)}
    </div>
    {user.profile.permissions.categories.manage && <div className="submit-container">   
        <button type="reset" >Reset</button>
        <button type="submit">Update</button>
    </div>}
</motion.form>
}
export default FoodCategories