import { useContext } from "react";
import {Navigate, useNavigate} from "react-router-dom"
import * as ROUTES from "../../ROUTES"
import { useEffect } from "react";
import { UserContext } from "../../contexts";
import { useState } from "react";
import Error from "../../components/Error"
import { useForm } from "react-hook-form";
import BackgroundAuth from "../../components/BackgroundAuth"
import {CreateProfile} from "../../lib/Auth"
const CreateProfileMain = ()=>{
    const user = useContext(UserContext)
    if(!user)
        return <Navigate to={ROUTES.AUTH.SINGIN} />
    if(user && user.profile)
        return <Navigate to={ROUTES.ORDERS.ALL} />

    return <BackgroundAuth element={<CreateProfileUi />}  />
}
const CreateProfileUi = ()=>{
    const {register,watch,handleSubmit} = useForm()
    const  {mutate} = CreateProfile()
    const usenav = useNavigate()
    const submit = async (data)=>{
        console.log(data)
        try{
            await mutate(data)
            usenav(ROUTES.ORDERS.ALL)
        }
        catch(err){
            console.log(err)
        }
    }
    
    return <>
    <h1>What's Your Name ?</h1>
    <form onSubmit={handleSubmit(submit)}>
        <input className="name-input" placeholder="Name..." type="text"{...register("name")} id="name" />
        <div className="name-button">
            <button type="submit">Finish</button>
        </div>
    </form>
    </>
}
export default CreateProfileMain