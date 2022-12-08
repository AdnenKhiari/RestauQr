import * as admin from "firebase-admin"
import { DataError } from "../../lib/Error"


export const GetCategories = async ()=>{
    const db = admin.firestore()
    const cat_ref = db.doc("utils/menu")
    const cat_snap = await cat_ref.get()
    if(!cat_snap.exists){
        throw new DataError("Categories not found",undefined)
    }
    return {id: cat_snap.id,...cat_snap.data()}
}
export const AddUpdateCategories = async (cats: any)=>{
    const db = admin.firestore()
    const cat_ref = db.doc("utils/menu")
    await cat_ref.update({
        categories: cats.categories
    })
}
export default {
    GetCategories,
    AddUpdateCategories
}