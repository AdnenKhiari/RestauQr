import * as admin from "firebase-admin"
import moment from "moment"
const GetTableById =  async (id: string)=>{
    const db = admin.firestore()
    const ref = db.doc("tables/"+id)
    
    const res = await ref.get()
    if(!res.exists)
        throw Error("Invalid table Id")

    return {id: ref.id,...res.data()}
}
const DeleteTableById =  async (id: string)=>{
    const db = admin.firestore()
    const ref = db.doc("tables/"+id)
    
    await ref.delete()
}
const GetTables =  async (searchData: any)=>{
    const db = admin.firestore()
    let col = db.collection("tables")
    const pagname = 'time'
    let query  = col.orderBy(pagname,searchData.dir || 'desc');
    if(searchData.id){
        query = query.where(admin.firestore.FieldPath.documentId(),'==',searchData.id)
    }else{
        if(searchData.startDate)
            query = query.where('time','>=',(moment(searchData.startDate).toDate()))
        if(searchData.endDate)
            query = query.where('time','<=',(moment(searchData.endDate).toDate()))
        if(searchData.disabled)
            query = query.where('disabled','==',true)
        if(searchData.placesNum)
            query = query.where('placesNum','==',parseInt(searchData.placesNum))
    }
    if(searchData.lastRef){
        const starting = await db.doc("tables/"+searchData.lastRef).get()
        if(!starting.exists)
            throw Error("Invalid Last Reference")
        if(searchData.swapped)
            query = query.startAt(starting)
        else
            query = query.startAfter(starting)

    }
    query = query.limit(2)
    const data = await query.get()
    console.log(data.docs.map((table)=>{return{ id:table.id,...table.data()}}))
    return data.docs.map((table)=>{return{ id:table.id,...table.data()}})
}


const AddUpdateTable = async (id:string | undefined,data: any)=>{
    const db = admin.firestore()
    const ref =  db.doc('tables/'+id)
    ref.set(data)
    return ref.id
}

export default {
    GetTableById,
    GetTables,
    DeleteTableById,
    AddUpdateTable
}