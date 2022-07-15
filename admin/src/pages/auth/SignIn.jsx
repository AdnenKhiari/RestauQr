import joi from "joi"
import {SignInUser} from "../../lib/Auth"
import * as ROUTES from "../../ROUTES"
import AuthForm from "../../components/AuthForm"
import BackgroundAuth from "../../components/BackgroundAuth"
import { Navigate } from "react-router-dom"
import { UserContext } from "../../contexts"
import { useContext } from "react"


const schema = joi.object({
    email: joi.string().email({tlds: {allow: false}}).required().label("Email"),
    password: joi.string().required().label("Password")
})
const formdata = [{label: "Email",name: "email",type: "email"},
{label: "Password",name: "password",type: "password"}
]

const SignIn = ()=>{
    const user = useContext(UserContext)

    const {result : signed_user,loading,error,signIn} = SignInUser()
    const submit = async (data)=>{
        try{
            console.log(data)
            await signIn(data.email,data.password)
        }catch(err){
            console.error(err)
        }
    }
    if(user)
        return <Navigate to={ROUTES.ORDERS.ALL} />
    return <BackgroundAuth element={<AuthForm title={"Sign In"} err={error ? error.msg : null} schema={schema} formdata={formdata} submit={submit} smalllink={ROUTES.AUTH.SIGNUP} smalltext="Do Not Have an account ? Sign Up"  />}   />
}
export default SignIn
