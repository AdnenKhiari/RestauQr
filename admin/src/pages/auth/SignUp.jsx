import joi from "joi"
import * as ROUTES from "../../ROUTES"
import AuthForm from "../../components/AuthForm"
import BackgroundAuth from "../../components/BackgroundAuth"
import {CreateUser} from "../../lib/Auth"
import { useContext } from "react"
import { UserContext } from "../../contexts"
import { Navigate } from "react-router-dom"
const schema = joi.object({
    email: joi.string().email({tlds: {allow: false}}).required().label("Email"),
    password: joi.string().required().label("Password"),
    confirmPassword: joi.string().valid(joi.ref("password"))
})
const formdata = [
    {label: "Email",name: "email",type: "email"},
    {label: "Password",name: "password",type: "password"},
    {label: "Confirm Password",name: "confirmPassword",type: "password"},
]
const SignUp = ()=>{
    const user = useContext(UserContext)
    const {result : newuser,loading,error,mutate} = CreateUser()
    const submit = async (data)=>{
        console.log(data)
        await mutate(data.email,data.password)
    }
    if(user)
        return <Navigate to={ROUTES.ORDERS.ALL} />
    return <BackgroundAuth element={<AuthForm title={"Sign Up"} err={error ? error.msg : null}  schema={schema} formdata={formdata} submit={submit} smalllink={[ROUTES.AUTH.SINGIN,ROUTES.AUTH.RESET_PASSWORD]} smalltext={["Have an account ? Sign In","Forgot password ? Reset It !"]} />} />
}
export default SignUp
