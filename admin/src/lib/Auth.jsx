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
import { QueryClient } from "@tanstack/react-query"


const axios_inst = axios.create({
    withCredentials: true
})
const getProfileInfo = async (id,db)=>{
    const user_col = collection(db,'users')
    const profile_snap = await getDoc(doc(user_col,id))
    if(profile_snap.exists()){
        return profile_snap.data()
    }else{
        return null
    }
}
export const UpdateProfile = ()=>{
    const [result,setResult] = useState(null)
    const [error,setError] = useState(null)
    const [loading,setLoading] = useState(null)

    const auth = getAuth()
    const db = getFirestore()
    const updateprofile = async (id,data)=>{
        setLoading(true)
        try{
            await updateDoc(doc(collection(db,'users'),id),data)
            setResult(auth.currentUser)
            return auth.currentUser 
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
        updateprofile
    }
}

export const RemoveAccount = ()=>{
    const [error,setError] = useState(null)
    const [loading,setLoading] = useState(null)

    const db = getFirestore()
    const auth = getAuth()
    const deleteAccount = async ()=>{
        setLoading(true)
        try{
            const id = auth.currentUser.uid
            await deleteUser(auth.currentUser)
            await deleteDoc(doc(collection(db,'users'),id))
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
        deleteAccount
    }
}

export const UpdateEmail = ()=>{
    const [result,setResult] = useState(null)
    const [error,setError] = useState(null)
    const [loading,setLoading] = useState(null)

    const auth = getAuth()
    const updateemail = async (email)=>{
        setLoading(true)

        try{
            await updateEmail(auth.currentUser,email)
            setResult(auth.currentUser)
            return auth.currentUser
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
        updateemail
    }
}

export const UpdatePassword = ()=>{
    const [result,setResult] = useState(null)
    const [error,setError] = useState(null)
    const [loading,setLoading] = useState(null)

    const auth = getAuth()
    const updatepassword = async (password)=>{
        setLoading(true)
        try{
            await updatePassword(auth.currentUser,password)
            setResult(auth.currentUser)
            return auth.currentUser
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
        updatepassword
    }
}

export const ConfirmIdentity = ()=>{

    const [result,setResult] = useState(null)
    const [error,setError] = useState(null)
    const [loading,setLoading] = useState(null)

    const auth = getAuth()

    const confirm = async (email,password)=>{
        setLoading(true)
        try{
            //here 
            // BUGGED 
            const cred = EmailAuthProvider.credential(email,password)
            const user_cred = await reauthenticateWithCredential(auth.currentUser,cred)
            setResult(user_cred.user)
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
    const {data,isLoading,error,mutateAsync} = Query.useMutation(['reset-email-confirmation'],async (oobCode)=>{
        const res = await axios_inst.post(APIROUTES.AUTH.CONFIRM_VALID,{
            oobCode: oobCode
        })
        return res.data
    })
    return {
        data,
        loading: isLoading,
        err : error,
        validateMail : mutateAsync
    }
}

export const GetAllProfiles = ()=>{
    const [result,setResult] = useState(null)
    const [error,setError] = useState(null)
    const [loading,setLoading] = useState(false)

    const db = getFirestore()
    const getdata = async ()=>{
        setLoading(true)
        try{
            const user_col = collection(db,'users')
            const alldocs = await getDocs(user_col)
            const res = alldocs.docs.map((item)=>{
                return {id : item.id,...item.data()}
            })
            setResult(res)
        }catch(err){
            setError(err)
        }finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        getdata()
    },[db])

    return {
        result,
        error,
        loading,
        getdata
    }
}
export const GetProfile = (id)=>{
    const [result,setResult] = useState(null)
    const [error,setError] = useState(null)
    const db = getFirestore()
    const getp = async ()=>{
        try{
            const profile = await getProfileInfo(id,db)
            if(!profile)
                throw Error("Invalid Profile ID Not Found")
            setResult({...profile,id})
        }catch(err){
            setError(err)
        }
    }
    useEffect(()=>{
        getp()
    },[db,id])
    return {
        result,
        error,
        loading: !result && !error
    }
}

export const CreateProfile = ()=>{
    const [result,setResult] = useState(null)
    const [error,setError] = useState(null)
    const [loading,setLoading] = useState(null)
    const user = useContext(UserContext)
    const db = getFirestore()
    const mutate = async (data)=>{
        try{
            setLoading(true)
            if(!user)
                throw Error("No User Is Logged In")
            const profile = {name: data.name,permissions: {
                food: {manage:false},
                orders: {manage: false},
                tables: {manage:false},
                categories: {manage:false},
                users: {read:false,manage:false}
            }}
            await setDoc(doc(collection(db,'users'),user.uid),profile)
            setResult(profile)
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
        mutate
    }
}

export const CreateUser = ()=>{


    const auth = getAuth()
    const {user: result,loading,error,mutateAsync} = LogUser()

    const mutate = async (email,password)=>{
        try{
            auth.setPersistence(inMemoryPersistence)
            const user_snap = await createUserWithEmailAndPassword(auth,email,password)
            await sendEmailVerification(auth.currentUser)
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
    const db = getFirestore()
    const {user,loading,error,mutateAsync} = LogUser()

    const signIn = async (email,password)=>{
        try{
            auth.setPersistence(inMemoryPersistence)
            const user_snap = await signInWithEmailAndPassword(auth,email,password)
            const profile = await getProfileInfo(user_snap.user.uid,db)
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
            refetch()
        }catch(err){
            throw err
        }
    }   
    return {
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
    const auth = getAuth()
  //  const [loading,setLoading ] = useState(null)
    const {data: user,isLoading,error} = Query.useQuery(['current_user'],getLoggedUserInfo,{
        retry: 2,
        refetchOnWindowFocus: false,
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
            setResult(true)
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

    const user = useContext(UserContext)
    const {data,isLoading,error,refetch} = Query.useQuery(['validte-email'],async()=>{
        const res = axios_inst.post(APIROUTES.AUTH.VALIDATE_EMAIL,{
            email: user.email
        })
        return res.data
    },{
        retry: 0,
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
