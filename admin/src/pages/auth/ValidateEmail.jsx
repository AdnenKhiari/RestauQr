import joi from "joi"
import {LogOut, VerifyEmailForUser} from "../../lib/Auth"
import { useEffect } from "react"
import { useContext } from "react"
import {UserContext} from "../../contexts"
import BackgroundAuth from "../../components/BackgroundAuth"
import { useState } from "react"
import {Navigate} from "react-router-dom"
import * as ROUTES from "../../ROUTES"

const ValidateEmailContent = ()=>{
    const {result,mutate,error} = VerifyEmailForUser()
    const [text,setText] = useState("Send")
    const {logout} = LogOut()

    const submit = ()=>{
        mutate()
    }

    if(error)
        console.error(error)
    return <div>
        <h1>Validate Email</h1>
        <form onSubmit={(e)=>e.preventDefault()} >
            <div>
            <button onClick={(e)=>{
            setText("Resend")
            submit()
        }}>{text} !</button>
        <button onClick={(e)=>{
            logout()
        }}>Log Out !</button>
            </div>

        </form>
    </div>
}
const ValidateEmail = ()=>{
    const user = useContext(UserContext)
    if(!user)
        return <Navigate to={ ROUTES.AUTH.SINGIN} />
    if(user && user.emailVerified)
        return <Navigate to={ ROUTES.ORDERS.ALL} />
    return <BackgroundAuth element={<ValidateEmailContent />} />
}
export default ValidateEmail
