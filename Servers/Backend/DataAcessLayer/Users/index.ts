import Express from "express"
import * as admin from "firebase-admin"

const GetAllUsers = async ()=>{
    const db = admin.firestore()
    const users_col = db.collection("users")
    const users = await users_col.get()
    return users.docs.map((dt: any)=>{return {id:dt.id,...dt.data()}})
}
const GetUserById = async (id: string)=>{
    const db = admin.firestore()
    const user_doc = db.doc("users/"+id)
    const user = await user_doc.get()
    if(!user.exists)
        throw Error("User Do Not Exists")
    const user_auth = await admin.auth().getUser(id)
    return {id: user.id,emailVerified : user_auth.emailVerified,email: user_auth.email,profile: user.data()}
}
const GetUserByIdIfExists = async (id: string)=>{
    const db = admin.firestore()
    const user_doc = db.doc("users/"+id)
    const user = await user_doc.get()
    if(!user.exists)
        return null
    return {id: user.id,...user.data()}
}
const RemoveUser = async (id: string)=>{
    const auth = admin.auth()
    const db = admin.firestore()
    const user_doc = db.doc("users/"+id)
   
    const user = await user_doc.get()
    if(!user.exists)
        throw Error("User Do Not Exists")
    await user_doc.delete({exists: true})
    await auth.deleteUser(id)
}
const UpdateEmail = async (id: string,email: string)=>{
    const auth = admin.auth()
    await auth.updateUser(id,{
        email: email
    })
}

const UpdatePassword = async (id: string,password: string)=>{
    const auth = admin.auth()
    await auth.updateUser(id,{
        password: password
    })
}

const UpdateUserInfo = async (id: string,data: any)=>{
    const db = admin.firestore()
    const user_doc = db.doc("users/"+id)
    await user_doc.update(data)
    return user_doc.id
}
const AddUpdateUser = async (uid:string,data: any) =>{
    const db = admin.firestore()
    const user_ref = db.doc('users/'+uid)
    user_ref.set(data,{merge: true})
    return user_ref.id
}

export const VerifyUserById = async (id:string)=>
{
    const auth = admin.auth()
    await auth.updateUser(id,{
        emailVerified: true
    })
}

export default {
    UpdateUserInfo,
    UpdatePassword,
    UpdateEmail,
    RemoveUser,
    GetUserById,
    GetAllUsers,
    AddUpdateUser,
    GetUserByIdIfExists,
    VerifyUserById
}