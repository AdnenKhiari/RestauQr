import * as admin from "firebase-admin"
import Express from "express"
import axios from "axios"
const cookieOpt = {
    httpOnly: true,
    secure: false,
    maxAge: 1000*60*60*10
}
export const IssueCookie = async (tokenid: string,res: Express.Response)=>{
    const auth = admin.auth()
    const ck = await auth.createSessionCookie(tokenid,{
        expiresIn: cookieOpt.maxAge
    })
    console.log("Issued Cookie",ck)
    return res.cookie('restau-admin-sess',ck,cookieOpt)
}

export const clearCookie = (res: Express.Response)=>{
    res.clearCookie('restau-admin-sess',cookieOpt)
}

export const DecodeCookie = async (req: Express.Request,res: Express.Response)=>{
    const auth = admin.auth()
    if(!req.cookies)
        return null
    const cookie = req.cookies['restau-admin-sess']
    if(!cookie)
        return null
    try{
        const decodedtoken = await auth.verifySessionCookie(req.cookies['restau-admin-sess'],true)
        return decodedtoken
    }catch(err){
        if(cookie)
            res.clearCookie(cookie)
        return null
    }
}

export const validateEmailOobCode = async (oobcode: string)=>{
    console.log(process.env.FIREBASE_API_KEY,oobcode)
    const codevalidation = await axios.post('https://identitytoolkit.googleapis.com/v1/accounts:update',{
        oobCode: oobcode
    },{
    params: {
        key: process.env.FIREBASE_API_KEY
    },
    headers: {
        "Content-Type" : "application/json"
    }
    })
    return codevalidation.data
}
export const validatePasswordOobCode = async (oobcode: string,newPassword: string)=>{
    const codevalidation = await axios.post('https://identitytoolkit.googleapis.com/v1/accounts:resetPassword',{
        oobCode: oobcode,
        newPassword
    },{
     params: {
        key: process.env.FIREBASE_API_KEY
     } 
    })
    return codevalidation.data
}   

export const getLevel = (scope: string)=>{
    if(scope === "none")
        return -1000
    if(scope === "read")
        return 0
    if(scope === "manage")
        return 1000
    return - 100000
}