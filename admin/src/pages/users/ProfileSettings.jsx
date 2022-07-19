import { useContext } from "react"
import { useState } from "react"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import { Navigate, useNavigate } from "react-router-dom"
import { UserContext } from "../../contexts"
import { RemoveAccount, UpdateEmail, UpdatePassword, UpdateProfile } from "../../lib/Auth"

import * as ROUTES from "../../ROUTES"
import ConfirmLogin from "../auth/ConfirmLogin"
const Permissions = ({permissions,disabled = false})=>{
    const {register,watch} = useFormContext() 
    return <div className="permissions-container">
        <h1>Permissions : </h1>

        <ul className="permissions-list">
            
            {permissions && Object.keys(permissions).map((key,index)=><li key={100+index} className="permission-name">
                <p>{key}</p>
                <ul className="permissions">
                {permissions[key] && Object.keys(permissions[key]).map((item,index2)=><li key={index2}>
                    <label htmlFor={key+"."+item}><img  className={watch("permissions."+key+'.'+item) ? 'make-img-blue' : undefined} src="/checkbox.png" alt="" />{item}</label>
                    { disabled  ? (
                    <input disabled={disabled} type="checkbox" id={key+"."+item} />) : (
                    <input disabled={disabled} type="checkbox" id={key+"."+item} { ...register("permissions."+key+"."+item)} />
                    )}
                    </li> )
                }
                </ul>
                </li>)}
        </ul>
    </div>
}

const Credentials = ()=>{
    
    const {register} = useFormContext() 
    return <div className="credentials-container">
        <h1>Credentials :</h1>
        <div className="input-form">
            <label htmlFor="email">Email: </label>
            <input type="email" placeholder="Update Email ..."  id="email" {...register("email")} />
        </div>

        <div className="input-form">
            <label htmlFor="password">Password: </label>
            <input type="password" placeholder={"Update Password..."} id="password" {...register("password")} />
        </div>

    </div>
}

const Infos = ({profile})=>{
    const {register} = useFormContext() 
    return <div className="profile-info">
        <h1>Info : </h1>
        <div className="input-form">
            <label htmlFor="name">Update Name : </label>
            <input type="text" placeholder={profile.name} id="name" {...register("name")} />
        </div>
    </div>
}

const ProfileSettings = ({profile,me = false})=>{

    const user = useContext(UserContext)
    const [confirm,setConfirm] = useState(null)
    const ctx = useForm({defaultValues: {name: profile.name,permissions: profile.permissions}})
    const mailUpdater = UpdateEmail()
    const passwordUpdate = UpdatePassword()
    const profileUpdate = UpdateProfile()
    const accountRemove = RemoveAccount()

    const usenav = useNavigate()
    const submit = (data)=>{
        setConfirm(data)
    }

    const accepted = async ()=>{

        console.log("Accepeted the data",confirm)
        if(confirm === "remove"){
            if(me){
                try{
                    await accountRemove.deleteAccount()
                    usenav(ROUTES.AUTH.SINGIN)
                }catch(err){
                    console.log(err)
                }
            }
        }else{
            if(me){

                try{
                    if(confirm.email)
                    await mailUpdater.updateemail(confirm.email)
                }catch(err){
                    console.log(err)
                }
    
                try{
                    if(confirm.password)
                    await passwordUpdate.updatepassword(confirm.password)
                }catch(err){
                    console.log(err)
                }
    
                try{
                    await profileUpdate.updateprofile(user.uid,{permissions:confirm.permissions,name: confirm.name})
                }catch(err){
                    console.log(err)
                }
    
            }else{
                try{
                    if(user.profile.permissions.users.manage && !profile.permissions.users.manage){
                        await profileUpdate.updateprofile(profile.id,{permissions:confirm.permissions})
                    }
                }catch(err){
                    console.log(err)
                }
            }
            setConfirm(null)
        }
    }

    const cancel = ()=>{
        console.log("Canceled")
        setConfirm(null)
    }

    if(!me && !user.profile.permissions.users.read)
        return <Navigate to={ROUTES.USERS.MY_PROFILE} />    
    if(confirm)
        return <ConfirmLogin callback={(e)=>accepted()} cancel={(e)=>cancel()} />
    return <FormProvider {...ctx} >
        <div className="profile-container">
            
            {!me && <h1>{profile.name}</h1>}
            <form onReset={(e)=>{e.preventDefault();ctx.reset()}} onSubmit={ctx.handleSubmit(submit)}>
                <div className="content">
                    {me && <Infos  profile={profile}/>}
                    {me && <Credentials  />}    
                    {<Permissions disabled={!( (me && profile.permissions.users.manage)  || (!profile.permissions.users.manage && user.profile.permissions.users.manage)) } permissions={profile.permissions} />}
                </div>
                {(me || (!profile.permissions.users.manage && user.profile.permissions.users.manage)) &&  <div className="submit-container">
                        {me &&                         <button onClick={(e)=>{
                            e.preventDefault()
                            setConfirm("remove")
                        }} className="error-btn" >Remove Profile</button>}
                        <button type="submit">Update</button>
                        <button type="reset">Reset</button>
                </div>  }
                {mailUpdater.error && <p className="error">{mailUpdater.error}</p>}
                {passwordUpdate.error && <p className="error">{passwordUpdate.error}</p>}
                {profileUpdate.error && <p className="error">{profileUpdate.error}</p>}
                {accountRemove.error && <p className="error">{accountRemove.error}</p>}

            </form>
        </div>
    </FormProvider>
}

export default ProfileSettings