import * as admin from "firebase-admin"
import moment from "moment"
import { addmerchandise, updatemerchandise } from "../../Inventory/Merchandise"
import Orders from "../../Orders"
const GetProductOrderById =  async (supplierid:string,id: string)=>{
    const db = admin.firestore()
    const path = 'suppliers/'+supplierid+"/productorders/"+id
    const ref = db.doc(path)
    const res = await ref.get()
    if(!res.exists)
        throw Error("Invalid Id")
    const productorders : any = {id: ref.id,...res.data()} 
    const allorders = await db.getAll(...productorders.orders.map((order: any,key: number)=>{
        return db.doc('products/'+order.product+'/product_instances/'+order.id)
    }))
    
    return {
        ...productorders,
        orders: allorders.map((doc,key: number)=>{
        return  {
            productorder_details: {...doc.data(),id: doc.id,wasted: undefined,used: undefined},
            details: productorders.orders[key].details,
            product: productorders.orders[key].product,
        }
    })}

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


const AddUpdateProductOrder = async (data: any,supplierid: string,id: string | undefined)=>{
    const db = admin.firestore()
    const path = 'suppliers/'+supplierid+"/productorders/"
    const thisref = id ? db.doc(path+id) : db.collection(path).doc() 
    await db.runTransaction(async tr=>{
        const ids : string[] = []
        data.orders.forEach((order: any,key: number)=>{
            const orderid = order.productorder_details.id
            delete order.productorder_details.id
            const prodref = db.doc('products/'+order.product)
            if(orderid){
                const ref = db.doc('products/'+order.product+'/product_instances/'+orderid)
                updatemerchandise(tr,prodref,ref,order.productorder_details,order.details !== "Completed")
                ids.push(orderid)
            }else{
                const ref = db.collection('products/'+order.product+'/product_instances/').doc()
                addmerchandise(tr,prodref,ref,order.productorder_details,order.details !== "Completed")
                ids.push(ref.id)
            }
        })       
        tr.set(thisref,{
            notes: data.notes,
            expected_delivery_date: data.expected_delivery_date,
            orders: ids.map((id,key: number)=>{
                return {id: id,details: data.orders[key].details,product: data.orders[key].product }
            })
        },{merge: true}) 
    })
    return thisref.id

}

export default {
    GetProductOrderById,
    AddUpdateProductOrder
}