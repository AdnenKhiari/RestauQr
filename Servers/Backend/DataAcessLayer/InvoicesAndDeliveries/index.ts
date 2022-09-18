import * as admin from "firebase-admin"
import moment from "moment"
const GetSupplierById =  async (id: string)=>{
    const db = admin.firestore()
    const ref = db.doc("suppliers/"+id)
    
    const res = await ref.get()
    if(!res.exists)
        throw Error("Invalid Id")

    return {id: ref.id,...res.data()}
}
const DeleteSupplierById =  async (id: string)=>{
    const db = admin.firestore()
    const ref = db.doc("suppliers/"+id)
    await ref.delete()
}
const GetSuppliers =  async (searchData: any)=>{
    const db = admin.firestore()
    let col = db.collection("suppliers")
    const pagname = 'name'
    let query  = col.orderBy(pagname,searchData.dir || 'desc');

    /*if(searchData.startDate)
        query = query.where('time','>=',(moment(searchData.startDate).toDate()))
    if(searchData.tableid)
        query = query.where('tableid','==',(searchData.tableid))
    if(searchData.endDate)
        query = query.where('time','<=',(moment(searchData.endDate).toDate()))
    if(searchData.status)
        query = query.where('status','==',(searchData.status))
    */
    if(searchData.lastRef){
        const starting = await db.doc("suppliers/"+searchData.lastRef).get()
        if(!starting.exists)
            throw Error("Invalid Last Reference")
        if(searchData.swapped)
            query = query.startAt(starting)
        else
            query = query.startAfter(starting)
    }
    query = query.limit(2)
    const data = await query.get()
    return data.docs.map((order)=>{return{ id:order.id,...order.data()}})
}


const AddUpdateSupplier = async (data: any,id: string | undefined)=>{
    const db = admin.firestore()
    var ref = null
    if(id){
        ref = db.doc('suppliers/'+id)
        const foodid = id+""
        await ref.update(data)
        return ref.id
    }else{
        ref = db.collection('suppliers')
        return (await ref.add(data)).id
    }

}

export default {
    GetSupplierById,
    GetSuppliers,
    DeleteSupplierById,
    AddUpdateSupplier
}