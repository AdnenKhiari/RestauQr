import { useState } from "react"
import {getAuth,inMemoryPersistence,updateEmail,EmailAuthProvider,reauthenticateWithCredential,signOut,onAuthStateChanged,createUserWithEmailAndPassword,sendEmailVerification, signInWithEmailAndPassword, sendPasswordResetEmail, confirmPasswordReset, updatePassword, deleteUser} from "firebase/auth"
import { useEffect } from "react"
import * as ROUTES from "../ROUTES"
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, setDoc, updateDoc } from "firebase/firestore"
import { useContext } from "react"
import { UserContext } from "../contexts"
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
    const [result,setResult] = useState(null)
    const [error,setError] = useState(null)
    const [loading,setLoading] = useState(null)

    const auth = getAuth()
    const mutate = async (email,password)=>{
        try{
            setLoading(true)
            auth.setPersistence(inMemoryPersistence)
            const user_snap = await createUserWithEmailAndPassword(auth,email,password)
            await sendEmailVerification(auth.currentUser)
            const token = await user_snap.user.getIdToken()
            //Sends Request To User , now it's gonna be just a console.log for postman 
            console.warn("TOKEN FROM FIREBASE ",token)
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
    const db = getFirestore()
    const signIn = async (email,password)=>{
        try{
            setLoading(true)
            auth.setPersistence(inMemoryPersistence)
            const user_snap = await signInWithEmailAndPassword(auth,email,password)
            const profile = await getProfileInfo(user_snap.user.uid,db)
            const token = await user_snap.user.getIdToken(true)
            //Sends Request To User , now it's gonna be just a console.log for postman 
            console.warn("TOKEN FROM FIREBASE ",token)

            const user = {...user_snap.user,profile}
            setResult(user)
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
    const [err,setError] = useState(null)
    const [loading,setLoading] = useState(true)

    const auth = getAuth()
    const db = getFirestore()
    useEffect(()=>{
        setLoading(true)
        const unsub = onAuthStateChanged(auth,async (user)=>{
            try{
                if(user){
                    const profile = await getProfileInfo(user.uid,db)
                    setUser({...user,profile})
                }else{
                    setUser(user)   
                }
            }catch(err){
                try{
                    await signOut(auth)
                    setError(err)
                }catch(err2){
                    setError([err,err2])
                }
            }finally{
                setLoading(false)
            }
        })
        return unsub    
    },[auth,db])
    console.log("USER",user,loading,err)
    return{
        user,
        err,
        loading
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
