import { useForm } from "react-hook-form"
import { joiResolver } from "@hookform/resolvers/joi"
import {Link} from "react-router-dom"
import * as ROUTES from "../ROUTES"

const AuthForm = ({err,title,formdata,schema,submit,btntitle,smalllink,smalltext})=>{
    const {register,setValue,reset,formState : {errors},watch,handleSubmit} = useForm({
        resolver : joiResolver(schema)
    })
    return <><h1>{title}</h1>
    <form onSubmit={handleSubmit(submit)}>
        {formdata && formdata.map((fm,key)=><div key={key} className="form-input">
            <label htmlFor={fm.name}>{fm.label}</label>
            <input className={errors[fm.name] ? 'input-error' : undefined} type={fm.type}  id={fm.name} {...register(fm.name)}/>
        </div>)}
        <div>
            {formdata && <button onClick={(e)=>reset()}>Reset</button>}
            <button type="submit">{btntitle || title}</button>
        </div>
        {err && <p className="error">{err}</p>}
    </form>
    <div className="a-container">
    {(smalllink && smalltext) && smalllink.map((lk,key)=><Link key={key} to={smalllink[key]} >{smalltext[key]}</Link>)}
    </div>
    </>
}
export default AuthForm