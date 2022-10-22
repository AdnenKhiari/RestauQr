import * as admin from "firebase-admin"
import moment from "moment"
const GetTemplateById =  async (productid:string,id: string)=>{
    const db = admin.firestore()
    const ref = db.doc("products/"+productid+"/templates/"+id)
    
    const res = await ref.get()
    if(!res.exists)
        throw Error("Invalid Template Id")

    return {id: ref.id,...res.data()}
}

const DeleteTemplate =  async (productid: string,id: string)=>{
    const db = admin.firestore()
    const temp = db.doc("/products/"+productid+"/templates/"+id)
    await db.runTransaction(async (tr)=>{
        tr.delete(temp)
    })
}
const GetTemplatesOfProduct = async (productid: string)=>{
    const db = admin.firestore()
    let col = db.collection("/products/"+productid+"/templates/")
    let snap = await col.get()
    if(snap.empty)
        return {data: []}
    return snap.docs.map((dc)=>({id: dc.id,...dc.data()}))
}

const AddUpdateTemplate = async (data: any,productid:string,id: string | undefined)=>{
    const db = admin.firestore()
    if(id){
        const ref = db.doc('products/'+productid+"/templates/"+id)
        await db.runTransaction(async tr =>{
            tr.update(ref,data)
        })
        return productid
    }else{
        const all_templates =  db.collection('products/'+productid+"/templates/")
        const snap = await all_templates.add(data)
        return snap.id  
    }
}
export default {
    GetTemplateById,
    GetTemplatesOfProduct,
    DeleteTemplate,
    AddUpdateTemplate 
}