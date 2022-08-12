import joi from "joi"
import {ConfirmIdentity, SignInUser} from "../../lib/Auth"
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

const ConfirmLogin = ({callback ,cancel})=>{
    const user = useContext(UserContext)

    const {result,loading,error,confirm} = ConfirmIdentity()
    const submit = async (data)=>{
        try{
            console.log(data)
            await confirm(data.email,data.password)
            await callback()
        }catch(err){
            console.error(err)
        }
    }
    console.log("Veify",error)
    
    if(!user)
        return <Navigate to={ROUTES.AUTH.SINGIN} />
    return <div className="modal"><BackgroundAuth element={<>
        <AuthForm title={"Confirm Login"} err={error ? error.msg : null} schema={schema} formdata={formdata} submit={submit} />
        <button onClick={(e)=>cancel()} className="cancel-button">cancel</button>
        </>}   />
        </div>
}
export default ConfirmLogin
