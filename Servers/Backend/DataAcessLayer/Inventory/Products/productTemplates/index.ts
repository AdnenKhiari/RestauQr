import * as admin from "firebase-admin"
import moment from "moment"
const DeleteTemplate =  async (productid: string)=>{
    const db = admin.firestore()
    const temp = db.doc("/products/"+productid)
    await db.runTransaction(async (tr)=>{
        tr.update(temp,{
            template: admin.firestore.FieldValue.delete()
        })
    })
}
const AddUpdateTemplate = async (data: any,productid:string)=>{
    const db = admin.firestore()
    const ref = db.doc('products/'+productid)
    await db.runTransaction(async tr =>{
        tr.update(ref,{template: data})
    })
    return productid
}
export default {
    DeleteTemplate,
    AddUpdateTemplate 
}