import { Link, Routes, useNavigate, useSearchParams } from "react-router-dom"
import BackgroundAuth from "../../components/BackgroundAuth";
import {applyActionCode,checkActionCode,getAuth} from "firebase/auth"
import { useContext } from "react";
import {Navigate} from "react-router-dom"
import * as ROUTES from "../../ROUTES"
import { useEffect } from "react";
import { UserContext } from "../../contexts";
import { useState } from "react";
import Error from "../../components/Error"
import {SendPasswordResetEmail} from "../../lib/Auth"
import { useForm } from "react-hook-form";


const ActionCodeResponseContent = ()=>{
    const user = useContext(UserContext)
    let [searchParams, setSearchParams] = useSearchParams();
    const mode = searchParams.get("mode")
    const oobCode = searchParams.get("oobCode")
    const apiKey = searchParams.get("apiKey")

    if(mode ==='verifyEmail')
        return <VerifyMail mode={mode} oobCode={oobCode} />
    if(mode === 'resetPassword'){
        return <ResetPassword oobCode={oobCode}/>
    }
    return <h1>Duknow But Valid</h1>
}
const VerifyMail = ({oobCode,mode})=>{

    const auth = getAuth()
    const user = useContext(UserContext)
    const [error,setError] = useState(null)
    const usenav = useNavigate()
    const verifyEmail = async ()=>{
        try{
           await applyActionCode(auth,oobCode)
           setError(false)
           usenav(0)
        }catch(err){
            setError(err)
            console.error(err)
        }
    }

    useEffect(()=>{
        if(mode === 'verifyEmail')
            verifyEmail()
    },[oobCode])
    if(error === null)
        return <h1>Verifying</h1>
    if(error)
        return <Error error={error}  msg="Error , Could Not Verify Request" />
    return <h1>Email Verified ! <Link to={ROUTES.USERS.PROFILE}>Profile</Link></h1>
    
}
const ResetPassword = ({oobCode})=>{
    const reset_pass = SendPasswordResetEmail()
    const usenav = useNavigate();
    const submit = async (data)=>{
        try{
            await reset_pass.verify(oobCode,data.password)
        }catch(err){
            console.error(err)
        }
    }
    const {watch,register,handleSubmit} = useForm()
    useEffect(()=>{
        if(reset_pass.result && !reset_pass.loading && !reset_pass.error)
            usenav(ROUTES.AUTH.SINGIN)
    },[reset_pass])
    return <form onSubmit={handleSubmit(submit)}>
        <div className="form-input">
        <label htmlFor="password">Password</label>
        <input type="password"  id="password" {...register("password")} />
        </div>
<div>
<button type="submit">Update Password</button>

</div>
    </form>

}
const ActionCodeResponse = ()=>{
    return < BackgroundAuth element={<ActionCodeResponseContent  />} />
}
export default ActionCodeResponse