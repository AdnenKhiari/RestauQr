import { useContext } from "react"
import { useState } from "react"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import { Navigate, useNavigate } from "react-router-dom"
import { UserContext } from "../../contexts"
import { LogOut, RemoveAccount, UpdateProfile } from "../../lib/Auth"

import * as ROUTES from "../../ROUTES"
import ConfirmLogin from "../auth/ConfirmLogin"


import { FadeIn } from "../../animations"
import {motion} from "framer-motion"
import { getLevel } from "../../lib/utils"

import radioimg from "../../images/radio.png"

const Permissions = ({permissions,disabled = false})=>{
    const {register,watch} = useFormContext() 
    return <div className="permissions-container">
        <h1>Permissions : </h1>

        <ul className="permissions-list">
            
            {permissions  && Object.keys(permissions).map((key,index)=><li key={100+index} className="permission-name">
                <p className="current-perm">{key} {<span> : {permissions[key]}</span> }</p>
                <ul className="permissions">
                    
                {permissions[key] && <li>
                    {/*<label htmlFor={key}><img  className={watch("permissions."+key) ? 'make-img-blue' : undefined} src={radioimg} alt="" />{key}</label>*/}
                    { !disabled  && (<>
                    <div className="permission-choice">
                        <input disabled={disabled} value="manage" type="radio" id={key+".manage"} { ...register("permissions."+key)} />
                        <label htmlFor={key+".manage"}>
                        <img className={watch("permissions."+key) ==="manage" ? 'make-img-blue' : undefined} src={radioimg} alt="" />
                            Manage
                        </label>
                    </div>
                    <div className="permission-choice">
                        <input disabled={disabled} value="read" type="radio" id={key+".read"} { ...register("permissions."+key)} />
                        <label htmlFor={key+".read"}>
                        <img className={watch("permissions."+key) ==="read" ? 'make-img-blue' : undefined} src={radioimg} alt="" />
                            Read
                        </label>
                    </div>
                    {!["categories","tables","food","orders","units"].find(k => k === key)  &&<div className="permission-choice">
                        <input disabled={disabled} value="none" type="radio" id={key+".none"} { ...register("permissions."+key)} />
                        <label htmlFor={key+".none"}>
                        <img className={watch("permissions."+key) ==="none" ? 'make-img-blue' : undefined} src={radioimg} alt="" />
                            None
                        </label>
                    </div>}
                    </>
                    )}
                    </li> 
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

const ProfileSettings = ({accountid,profile,me = false})=>{

    const user = useContext(UserContext)
    const [confirm,setConfirm] = useState(null)
    const ctx = useForm({defaultValues: {name: profile.name,permissions: profile.permissions}})
    const profileUpdate = UpdateProfile(accountid)
    const accountRemove = RemoveAccount(accountid)
    const logout = LogOut()
    console.warn(profile,user)
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
                    await logout.logout()
                    usenav(ROUTES.AUTH.SINGIN)
                }catch(err){
                    console.log(err)
                }
            }
        }else{
            if(me){
                try{
                    await profileUpdate.updateprofile({password: confirm.password,
                        email : confirm.email,
                        permissions:confirm.permissions,
                        name: confirm.name})
                }catch(err){
                    console.log(err)
                }
            }else{
                try{
                    if(user.profile.permissions.users.manage && !profile.permissions.users.manage){
                        await profileUpdate.updateprofile({permissions:confirm.permissions})
                    }
                }catch(err){
                    console.log(err)
                }
            }
            setConfirm(null)
            usenav(0)
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
        <motion.div variants={FadeIn()} className="profile-container">
            
            {!me && <h1>{profile.name}</h1>}
            <form onReset={(e)=>{e.preventDefault();ctx.reset()}} onSubmit={ctx.handleSubmit(submit)}>
                <div className="content">
                    {me && <Infos  profile={profile}/>}
                    {me && <Credentials  />}    
                    {<Permissions disabled={!( (me && getLevel(profile.permissions.users) >= getLevel("manage"))  || (!(getLevel(profile.permissions.users) >= getLevel("manage"))&& getLevel(user.profile.permissions.users) >= getLevel("manage"))) } permissions={profile.permissions} />}
                </div>
                {(me || (!profile.permissions.users.manage && user.profile.permissions.users.manage)) &&  <div className="submit-container">
                        {me &&                         <button onClick={(e)=>{
                            e.preventDefault()
                            setConfirm("remove")
                        }} className="error-btn" >Remove Profile</button>}
                        <button type="submit">Update</button>
                        <button type="reset">Reset</button>
                </div>  }
{
    /*
                    {profileUpdate.err && <p className="error">{profileUpdate.err}</p>}
                {accountRemove.error && <p className="error">{accountRemove.error}</p>}
                 */
}


            </form>
        </motion.div>
    </FormProvider>
}

export default ProfileSettings