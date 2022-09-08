import * as admin from "firebase-admin"


export const GetUnits = async ()=>{
    const db = admin.firestore()
    const cat_ref = db.doc("utils/units")
    const cat_snap = await cat_ref.get()
    if(!cat_snap.exists){
        throw Error("Document Not Exists")
    }
    return {id: cat_snap.id,...cat_snap.data()}
}
export const AddUpdateUnits = async (data: any)=>{
    const db = admin.firestore()
    const cat_ref = db.doc("utils/units")
    await cat_ref.update({
        allunits: data.allunits
    })
}
export default {
    GetUnits,
    AddUpdateUnits
}