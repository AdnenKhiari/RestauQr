import { joiResolver } from "@hookform/resolvers/joi"
import { useForm,useFieldArray } from "react-hook-form"
import joi from "joi"
import {GetTables, UpdateTable} from "../../lib/Options"
import Error from "../../components/Error"
import Loading from "../../components/Loading"
import { useContext } from "react"
import {UserContext} from "../../contexts"
import {motion} from "framer-motion"
import { FadeIn } from "../../animations"

const schema  = joi.object({
    min: joi.number().min(0).required().label("Minimum"),
    max: joi.number().min(joi.ref("min")).required().label("Maximum"),
    exclude: joi.array().items(joi.number().min(joi.ref("min",{ancestor: 2})).max(joi.ref("max",{ancestor: 2}))).label("Exclude")
})
const Tables = ()=>{
    const {result,error,loading} = GetTables()
    if(error)
        return <Error msg={"An Error Has occured While Fetching Categories"} error={error}  />
    if(loading)
        return <Loading />
    return <TablesForm tables={result} />
}
const TablesForm = ({tables})=>{
    const {watch,control,register,handleSubmit,reset,formState : {errors}}= useForm({
        resolver: joiResolver(schema),
        defaultValues: tables
    })
    console.log(errors)
    const {append,remove} = useFieldArray({
        control: control,
        name: 'exclude'
    })
    const user = useContext(UserContext)
    const {mutate,loading,error} = UpdateTable()
    const submit = async (data)=>{
        console.log(data)
        try{
            await mutate(data)
        }catch(err){
            console.log(err)
        }
    }
    return <motion.div  variants={FadeIn()} className="table-container">
        <h1>Tables</h1>
        <form onSubmit={handleSubmit(submit)} onReset={(e)=>{e.preventDefault();reset()}}>
            <div >
                <div className="input-form">
                    <label htmlFor="min">Minimum</label>
                    <input disabled={!user.profile.permissions.tables.manage} className={errors["min"] ? "input-error" : undefined}  type="number" id="min" {...register("min")} />
                </div>
                <div className="input-form">
                    <label htmlFor="max">Maximum</label>
                    <input disabled={!user.profile.permissions.tables.manage} className={errors["max"] ? "input-error" : undefined} type="number" id="max" {...register("max")} />
                </div>
            </div>

            <div className="input-form">
                <label>Exclude {user.profile.permissions.tables.manage && <img onClick={(e)=>append('')} className="make-img-green" src="/plus.png" alt="plus" />}</label>
                <div className="tables-excluded">
                {watch("exclude") && watch("exclude").map((val,key)=><div className={errors[`exclude`] && errors[`exclude`][key] ? "input-error" : undefined}     key={key}>
                <input disabled={!user.profile.permissions.tables.manage} placeholder="..." type="number" {...register(`exclude.${key}`)} />
                {user.profile.permissions.tables.manage && <img onClick={(e)=>remove(key)} src="/trash.png" alt="remove" /> }
                </div>)}
                </div>
            </div>
            
            {user.profile.permissions.tables.manage && <div className="submit-container">
            <button type="reset">Reset</button>
            <button type="submit">Update</button>
            </div>} 
        </form>
    </motion.div>
}   
export default Tables