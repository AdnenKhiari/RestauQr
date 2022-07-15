import { useState } from "react"
import {getAuth,signOut,onAuthStateChanged,createUserWithEmailAndPassword,sendEmailVerification, applyActionCode, checkActionCode, signInWithEmailAndPassword, sendPasswordResetEmail, verifyBeforeUpdateEmail, confirmPasswordReset, verifyPasswordResetCode} from "firebase/auth"
import { useEffect } from "react"
//import {Auth} from "firebase-error-codes"

export const CreateUser = ()=>{
    const [result,setResult] = useState(null)
    const [error,setError] = useState(null)
    const [loading,setLoading] = useState(null)

    const auth = getAuth()
    const mutate = async (email,password)=>{
        try{
            setLoading(true)
            const user_snap = await createUserWithEmailAndPassword(auth,email,password)
            await sendEmailVerification(auth.currentUser)
            setResult(user_snap.user)
            return user_snap.user
        }catch(err){
            if(err.code==="auth/email-already-in-use"){
                err.msg = "Email Already exists , consider Signing in instead or contact an admin"
            }else if(err.code==="auth/weak-password"){
                err.msg = "Error , Weak Password (at least 6 caracters)"
            }else if(err.code==="auth/too-many-requests"){
                err.msg = 'Error , Too many bad attempts , the account has been temporarly blocked reset the password or wait'
            }else{
                err.msg = 'Error , Make sure to have valid inputs , if the error persists contact an admin'
            }
            setError(err)
            throw err
        }finally{
            setLoading(false)
        }
    }   
    return {
        result,
        loading,
        error,
        mutate
    }
}
export const SignInUser = ()=>{
    const [result,setResult] = useState(null)
    const [error,setError] = useState(null)
    const [loading,setLoading] = useState(null)

    const auth = getAuth()
    const signIn = async (email,password)=>{
        try{
            setLoading(true)
            const user_snap = await signInWithEmailAndPassword(auth,email,password)
            setResult(user_snap.user)
            return user_snap.user
        }catch(err){
            if(err.code==="auth/user-not-found"){
                err.msg = "Email Do not exist"
            }else if(err.code==="auth/wrong-password"){
                err.msg = "Wrong Password"
            }else if(err.code==="auth/too-many-requests"){
                err.msg = 'Error , Too many bad attempts , the account has been temporarly blocked reset the password or wait'
            }else{
                err.msg = 'Error , Make sure to have valid inputs , if the error persists contact an admin'
            }
            setError(err)
            throw err
        }finally{
            setLoading(false)
        }
    }   
    return {
        result,
        loading,
        error,
        signIn
    }
}

export const LogOut = ()=>{
    const [error,setError] = useState(null)
    const [loading,setLoading] = useState(null)

    const auth = getAuth()
    const logout = async ()=>{
        try{
            setLoading(true)
            await signOut(auth)
        }catch(err){
            setError(err)
            throw err
        }finally{
            setLoading(false)
        }
    }   
    return {
        loading,
        error,
        logout
    }
}

export const GetAuthState = ()=>{
    const [user,setUser] = useState(undefined)

    const auth = getAuth()
    useEffect(()=>{
        const unsub = onAuthStateChanged(auth,(user)=>{
            setUser(user)
        })
        return unsub    
    },[auth])
    console.log("USER",user)
    return{
        user,
        loading: user === undefined 
    }
}

export const SendPasswordResetEmail = ()=>{
    const [result,setResult] = useState(null)
    const [error,setError] = useState(null)
    const [loading,setLoading] = useState(null)

    const auth = getAuth()
    const send_reset = async (email)=>{
        try{
            setLoading(true)
            await sendPasswordResetEmail(auth,email)
            setResult(email)
        }catch(err){
            setError(err)
            throw err
        }finally{
            setLoading(false)
        }
    }   
    const verify = async (code,new_password)=>{
        try{
            setLoading(true)
            await confirmPasswordReset(auth,code,new_password)
            setResult(code)
        }catch(err){
            setError(err)
            throw err
        }finally{
            setLoading(false)
        }
    }
    return {
        result,
        loading,
        error,
        send_reset,
        verify
    }
}

export const VerifyEmailForUser = ()=>{
    const [result,setResult] = useState(null)
    const [error,setError] = useState(null)
    const auth = getAuth()
    const mutate = async ()=>{
        try{
            if(!auth.currentUser)
                throw Error('Not Signed In')
            const user_snap = await sendEmailVerification(auth.currentUser)
            setResult(user_snap)
        }catch(err){
            setError(err)
            throw err
        }
    }   
    return {
        result,
        error,
        mutate
    }
}
