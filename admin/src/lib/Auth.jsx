import { useState } from "react"
import {getAuth,sign,inMemoryPersistence,updateEmail,EmailAuthProvider,reauthenticateWithCredential,signOut,onAuthStateChanged,createUserWithEmailAndPassword,sendEmailVerification, signInWithEmailAndPassword, sendPasswordResetEmail, confirmPasswordReset, updatePassword, deleteUser, signInWithCredential} from "firebase/auth"
import { useEffect } from "react"
import * as ROUTES from "../ROUTES"
import * as APIROUTES from "../APIROUTES"

import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, setDoc, updateDoc } from "firebase/firestore"
import { useContext } from "react"
import { UserContext } from "../contexts"
import * as Query from "@tanstack/react-query"
import axios from "axios"


const axios_inst = axios.create({
    withCredentials: true,
    headers: {
        "Content-Type" : "application/json"
    }
})

export const CreateProfile = ()=>{
    const [error,setError] = useState(null)
    const {data:result,isLoading,error: query_err,mutateAsync: send} = Query.useMutation(async (data)=>{
       //console.warn(all)
      const res = await axios_inst.post(APIROUTES.AUTH.CREATE_PROFILE,data)
      return res.data
    },{
        retry: 0
    })

    const mutate = async (data)=>{
        try{
            await send({name: data.name})
        }catch(err){
            setError(err)
            throw err
        }
    }
    console.log("Create profile",result,isLoading,error)

    useEffect(()=>{
        setError(query_err)
    },[query_err])

    return {
        result,
        error,
        loading: isLoading,
        mutate
    }
}

export const SendPasswordResetEmail = ()=>{
    const [error,setError] = useState(null)

    const {data: senddata,isLoading: sendLoading,error :quer_err,mutateAsync: sendmail} = Query.useMutation(async (email)=>{
        const res = await axios_inst.post(APIROUTES.AUTH.RECOVER_PASSWORD,email)
        return res.data
    })

    const {data: confirmdata,isLoading: confirmLoading,error :confirm_err,mutateAsync: confirm} = Query.useMutation(async (dt)=>{
        const res = await axios_inst.post(APIROUTES.AUTH.CONFIRM_VALID_PASSWORD,dt)
        return res.data
    })

    useEffect(()=>{
        setError([quer_err,confirm_err])
    },[quer_err,confirm_err])


    const send_reset = async (email)=>{
        try{
            
            await sendmail({email: email})
            
        }catch(err){
            setError(err)
            throw err
        }
    }   
    const verify = async (code,new_password)=>{
        try{
            
            await confirm({oobCode: code,newPassword: new_password})
            
        }catch(err){
            setError(err)
            throw err
        }
    }
    return {
        result: confirmdata | senddata,
        loading: confirmLoading | sendLoading,
        err : error,
        send_reset,
        verify
    }
}


export const DeleteCurrent = ()=>{
    const [error,setError] = useState(null)
    const {data,isLoading,error: quer_err,refetch} = Query.useQuery(['delete-user','user'],async ()=>{
        const res = await axios_inst.delete(APIROUTES.USERS.DELETE_CURRENT)
        return res.data
    },{
        retry: 0,
        enabled: false,
        refetchOnWindowFocus: false
    })
    const fetch = async ()=>{
        try{
            await refetch()
        }catch(err){
            setError(err)
        }
    }
    console.log("Delete account",data,isLoading,error)
    useEffect(()=>{
        setError(quer_err)
    },[quer_err])
    
    return {
        result : data && data.data,
        error,
        loading: isLoading,
        deleteAccount: fetch
    }
}

export const RemoveAccount = (id)=>{
    const [error,setError] = useState(null)
    const {data,isLoading,error: quer_err,refetch} = Query.useQuery(['delete-user','user'],async ()=>{
        const res = await axios_inst.delete(APIROUTES.USERS.REMOVE_USER_BY_ID(id))
        return res.data
    },{
        retry: 0,
        enabled: false,
        refetchOnWindowFocus: false
    })
    const fetch = async ()=>{
        try{
            await refetch()
        }catch(err){
            setError(err)
        }
    }
    console.log("Delete account",data,isLoading,error)
    useEffect(()=>{
        setError(quer_err)
    },[quer_err])
    
    return {
        result : data && data.data,
        error,
        loading: isLoading,
        deleteAccount: fetch
    }
}



export const ConfirmIdentity = ()=>{

    const [result,setResult] = useState(null)
    const [error,setError] = useState(null)
    const [loading,setLoading] = useState(null)
    const user = useContext(UserContext)
    const auth = getAuth()

    const confirm = async (email,password)=>{
        setLoading(true)
        try{
            //here 
            // BUGGED 
            const cred = EmailAuthProvider.credential(email,password)
            const user_cred = await signInWithCredential(auth,cred)
            
            if(user_cred.user.uid === user.id){
                setResult(true)
                await signOut(auth)
            }else{
                await signOut(auth)
                throw Error("Could Not Confirm Identity")
            }
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
        confirm
    }
}

export const VerifyEmailCode = ()=>{
    const {data,isLoading,error,mutateAsync} = Query.useMutation(async (oobCode)=>{
        const res = await axios_inst.post(APIROUTES.AUTH.CONFIRM_VALID_EMAIL,{
            oobCode: oobCode
        })
        return res.data
    })
    console.log("Verifying,",data,isLoading,error)
    return {
        data,
        loading: isLoading,
        err : error,
        validateMail : mutateAsync
    }
}

export const GetAllProfiles = ()=>{
    const [error,setError] = useState(null)
    const {data,isLoading,error: quer_err,refetch} = Query.useQuery(['users'],async ()=>{
        const res = await axios_inst.get(APIROUTES.USERS.GET_USERS)
        return res.data
    },{
        retry: 0,
        refetchOnWindowFocus: false
    })
    const fetch = async ()=>{
        try{
            await refetch()
        }catch(err){
            setError(err)
        }
    }
    //console.log("Dt",data,isLoading,error)
    useEffect(()=>{
        setError(quer_err)
    },[quer_err])
    
    return {
        result : data && data.data,
        error,
        loading: isLoading,
        getdata: fetch
    }
}
export const GetProfile = (id)=>{
    const [error,setError] = useState(null)
    const {data,isLoading,error: quer_err,refetch} = Query.useQuery(['users',id],async ()=>{
        const res = await axios_inst.get(APIROUTES.USERS.GET_USER_BY_ID(id))
        return res.data
    },{
        retry: 0,
        refetchOnWindowFocus: false
    })
    const fetch = async ()=>{
        try{
            await refetch()
        }catch(err){
            setError(err)
        }
    }
    //console.log("Dt",data,isLoading,error)
    useEffect(()=>{
        setError(quer_err)
    },[quer_err])
    
    return {
        result : data && data.data,
        error,
        loading: isLoading,
        fetch
    }
}

export const CreateUser = ()=>{


    const auth = getAuth()
    const {user: result,loading,error,mutateAsync} = LogUser()

    const mutate = async (email,password)=>{
        try{
            auth.setPersistence(inMemoryPersistence)
            const user_snap = await createUserWithEmailAndPassword(auth,email,password)
            const token = await user_snap.user.getIdToken(true)
            await mutateAsync(token)
            console.warn("TOKEN FROM FIREBASE ",token)
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
            throw err
        }
    }   
    return {
        result,
        loading,
        error,
        mutate
    }
}
const getLoggedUser = async (tokenid)=> {
    const res = await axios_inst.post(APIROUTES.AUTH.SIGN_IN,{
        tokenid: tokenid
    },{
        
        withCredentials: true
    })
    return res.data
}

const LogUser = ()=>{
    const client = Query.useQueryClient()

    const {data: user,loading,error,mutateAsync} = Query.useMutation(['signin'],getLoggedUser,{
        onSuccess : (dt)=>{
            console.log("User FOund Succsflly , invalidting info",dt)
            client.invalidateQueries('current_user')
        },
        onError: (err)=>{
            console.log("Err",err)
        }
    })
    return {
        user,
        loading,
        error, 
        mutateAsync  
 }
}

export const SignInUser = ()=>{
    const auth = getAuth()
    const {user,loading,error,mutateAsync} = LogUser()

    const signIn = async (email,password)=>{
        try{
            auth.setPersistence(inMemoryPersistence)
            const user_snap = await signInWithEmailAndPassword(auth,email,password)
            const token = await user_snap.user.getIdToken(true)
            await mutateAsync(token)

            console.warn("TOKEN FROM FIREBASE ",token)

            return user
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
            throw err
        }
    }   
    return {
        user,
        loading,
        error,
        signIn
    }
}

export const LogOut = ()=>{

    const {data,isLoading,error,refetch} = Query.useQuery(['logout'],async ()=>{
        const res = await axios_inst.get(APIROUTES.AUTH.LOGOUT)
        return res.data
    },{
        enabled: false
    })
    const logout = async ()=>{
        try{
           await refetch()
        }catch(err){
            throw err
        }
    }   
    return {
        data,
        loading: isLoading,
        error,
        logout
    }
}
const getLoggedUserInfo = async ()=> {
    console.log("ANA hWA")
    const res = await axios_inst.get(APIROUTES.USERS.GET_CURRENT_USER,{
        withCredentials:true
    })
    return res.data
}


export const GetAuthState = ()=>{
    const client = Query.useQueryClient()
  //  const [loading,setLoading ] = useState(null)
    const {data: user,isLoading,error} = Query.useQuery(['current_user'],getLoggedUserInfo,{
        retry: 2,
        refetchOnWindowFocus: false,
        cacheTime: 0,
        onSuccess : (dt)=>{
            console.log("User FOund",dt)
         //   setLoading(false)
        },
        onError: (err)=>{
            console.log("Err",err)
           //setLoading(false)

        }
    })

    console.log("USER",user,isLoading,error)
    return{
        user: (user &&  user.data)|| undefined,
        err: error,
        loading : isLoading 
    }
}


export const VerifyEmailForUser = ()=>{

    const user = useContext(UserContext)
    console.warn({
        email: user
    })
    const {data,isLoading,error,refetch} = Query.useQuery(['verify-email'],async()=>{
        const res = axios_inst.post(APIROUTES.AUTH.VALIDATE_EMAIL,{
            email: user.email
        })
        return res.data
    },{
        retry: 0,
        cacheTime: 0,
        refetchOnMount: false,
        refetchOnWindowFocus: false
    })
    const mutate = async ()=>{
        try{
            await refetch()
        }catch(err){
            throw err
        }
    }   
    console.log("Resultat validate send",data)
    return {
        result: data,
        error,
        loading: isLoading,
        mutate
    }
}


export const UpdateProfile  = (id)=>{
    const {data,isLoading,error,mutateAsync} = Query.useMutation(async (data)=>{
        const res = await axios_inst.put(APIROUTES.USERS.UPDATE_USER(id),data)
        return res.data
    })
    const mutate = async (data)=>{
        await mutateAsync(data)
    }
    return {
        data,
        loading: isLoading,
        err : error,
        updateprofile : mutate
    }
}