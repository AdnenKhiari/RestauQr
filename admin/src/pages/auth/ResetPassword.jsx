import joi from "joi"
import {SendPasswordResetEmail} from "../../lib/Auth"
import { useEffect } from "react"
import { useContext } from "react"
import {UserContext} from "../../contexts"
import BackgroundAuth from "../../components/BackgroundAuth"
import { useState } from "react"
import {Navigate} from "react-router-dom"
import * as ROUTES from "../../ROUTES"
import AuthForm from "../../components/AuthForm"

const schema = joi.object({
    email: joi.string().email({tlds: {allow: false}}).required().label("Password")
})
const ResetPasswordContent = ()=>{

    const {result,error,loading,send_reset} = SendPasswordResetEmail()
    const [text,setText] = useState("Send")

    const submit = async (data)=>{
        await send_reset(data.email)
    }

    const formdata = [{type: "email",name: "email",label:'Email'}]

    if(error)
        console.error(error)

    return <AuthForm submit={submit}  schema={schema} formdata={formdata} title={"Reset Password"} />
}
const ResetPassword = ()=>{
    const user = useContext(UserContext)

    return <BackgroundAuth element={<ResetPasswordContent user={user} />} />
}
export default ResetPassword
