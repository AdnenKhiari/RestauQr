import * as admin from "firebase-admin"
import { v4 as uuidv4 } from 'uuid';


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
    const product_ref = db.collection("products")
    const newunits = data.allunits.map((unit: any)=>{
        if(!unit.id)
            return {id: uuidv4(),...unit}
        else 
            return unit
    })  
    await db.runTransaction(async (tr)=>{
        const oldunits_snap = await tr.get(cat_ref)
        if(!oldunits_snap.exists)
            throw Error("Units document is not available")

        const allproducts_snaps = await tr.get(product_ref)
        const allproducts = allproducts_snaps.docs.map((prd)=>({id:prd.id,...prd.data()}))
        const olddata : any = oldunits_snap.data()
        const oldunits = olddata.allunits

        oldunits.forEach((old: any) => {
            let unit_existing: any = null
            if(old.id)
            unit_existing = newunits.find((u: any)=>u.id === old.id )
            //check if needs to be deleted
            if(!unit_existing){
                //to be deleted if no product in using it :
                const prd : any = allproducts.find((prd: any)=>prd.unit.id === old.id)
                if(prd)
                    throw Error("Unit Is In Use In product :"+ prd.name +" , Could Not Remove It !")
            }
        })   

        tr.update(cat_ref,{
            backup: oldunits,
            allunits: newunits.map((nw: any)=>{
                if(nw.id){
                    const old = oldunits.find((old: any)=>old.id === nw.id)
                    if(old)
                        return old
                }
                return nw
            })
        })
    })
}
export default {
    GetUnits,
    AddUpdateUnits
}