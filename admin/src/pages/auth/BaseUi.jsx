import { useForm } from "react-hook-form"
import { joiResolver } from "@hookform/resolvers/joi"
import {Link} from "react-router-dom"
import * as ROUTES from "../../ROUTES"

const BaseUi = ({schema,title,formdata,submit})=>{
    const {register,setValue,reset,formState : {errors},watch,handleSubmit} = useForm({
        resolver : joiResolver(schema)
    })
    return <div className="auth-container">
        <div className="auth-left">
            <img src="/auth.jpg" alt="auth" />
        </div>
        <div className="auth-right">
            <h1>{title}</h1>
            <form onSubmit={handleSubmit(submit)}>
                {formdata && formdata.map((fm,key)=><div key={key} className="form-input">
                    <label htmlFor={fm.name}>{fm.label}</label>
                    <input className={errors[fm.name] ? 'input-error' : undefined} type={fm.type}  id={fm.name} {...register(fm.name)}/>
                </div>)}
                <div>
                    <button onClick={(e)=>reset()}>Reset</button>
                    <button type="submit">{title}</button>
                </div>
            </form>
            <Link to={title === 'Sign In' ? ROUTES.AUTH.SIGNUP : ROUTES.AUTH.SINGIN } >{title === 'Sign In' ? 'Need An Account ? Sign Up' : 'Have an account ? Sign In' }</Link>
        </div>
    </div>
}
export default BaseUi