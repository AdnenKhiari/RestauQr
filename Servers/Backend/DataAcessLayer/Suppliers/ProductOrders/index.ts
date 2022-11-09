import * as admin from "firebase-admin"
import moment from "moment"
import { addmerchandise, updatemerchandise } from "../../Inventory/Merchandise"
import Orders from "../../Orders"
import { v4 as uuidv4 } from 'uuid';


const GetProductOrderById =  async (supplierid:string,id: string)=>{
    const db = admin.firestore()
    const path = 'suppliers/'+supplierid+"/productorders/"+id
    const ref = db.doc(path)
    const res = await ref.get()
    if(!res.exists)
        throw Error("Invalid Id")
    const productorders : any = {id: ref.id,...res.data()} 
    const allorders = await db.getAll(...productorders.orders.map((order: any,key: number)=>{
        return db.doc('products/'+order.product+'/product_instances/'+order.merchandiseid)
    }))
    
    return {
        id: productorders.id,
        notes : productorders.notes,
        expected_delivery_date : productorders.expected_delivery_date,
        orders: allorders.map((doc,key: number)=>{
            const ord_data : any= doc.data()
            if(!doc.exists)
                throw Error("Invalid document")
        return  {
            productorder_details: {id: doc.id,name : ord_data.name,unitPrice : ord_data.unitPrice,productQuantity : ord_data.productQuantity },
            details: productorders.orders[key].details,
            product: productorders.orders[key].product,
            id: productorders.orders[key].id
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

//if new product orders in orders : only accept the details and id otherwise error out 
//read all changed status data first , determine if it needs to be enabled and update stock accordingly !
const AddUpdateProductOrder = async (data: any,supplierid: string,id: string | undefined)=>{
    const db = admin.firestore()
    const path = 'suppliers/'+supplierid+"/productorders/"
    const current_order_ref = id ? db.doc(path+id) : db.collection(path).doc() 
    await db.runTransaction(async tr=>{
        const ids : any[] = []
        const to_update = data.orders.filter((order: any)=>{
            return order.id !== undefined
        })
        if(id){
            const current_order_snap = await tr.get(current_order_ref)
            if(!current_order_snap.exists)
                throw Error("Invalid Id")
            const current_order : any = current_order_snap.data()
            console.warn("This is lel",current_order,to_update,data.orders)

            //to make sure you can update the status and the quantities 
            if(to_update.length > 0){
                const to_update_snaps = await tr.getAll(...to_update.map((order: any)=>db.doc('products/'+order.product+"/product_instances/"+order.productorder_details.id)))
                to_update_snaps.forEach(async (dl,key: number)=>{
    
                    if(!dl.exists)
                        throw Error("Merchandise Not Found")
                    //merchandise instance
                    const current_mechandise : any = dl.data()
                    const futur_productorder = to_update[key]
                    const current_productorder = current_order.orders.find((ord: any)=> ord.id === futur_productorder.id )
                    console.warn("This is lel",current_productorder,futur_productorder)

                    if(!(current_productorder.details.status === "Completed" && futur_productorder.details.status === "Completed")){
                        if((current_productorder.details.status === "Completed" && futur_productorder.details.status !== "Completed")){
                            throw Error("Invalid Status Changes")
                        }
                        if((current_productorder.details.status === "Waiting" && futur_productorder.details.status === "Completed")){
                            const new_quantity = current_mechandise.unitQuantity * current_mechandise.productQuantity
                            const prodref = db.doc('products/'+current_productorder.product)
                            //add merchandise quantity to stock
                            tr.update(prodref,{
                                stockQuantity: admin.firestore.FieldValue.increment(new_quantity)
                            })           
                            //make merchandise enabled  
                            const ref = db.doc('products/'+current_productorder.product+'/product_instances/'+current_productorder.merchandiseid)
                            tr.update(ref,{
                                disabled: false
                            })       
                        }else if(current_productorder.details.status === "Canceled" && futur_productorder.details.status !== "Canceled" ){
                            throw Error("Invalid Status Change")
                        }
                    }
                })
            }
    
        }

        data.orders.forEach((order: any,key: number)=>{
            const productorderid = order.id
            const prodref = db.doc('products/'+order.product)
            if(!productorderid){
                const ref = db.collection('products/'+order.product+'/product_instances/').doc()
                addmerchandise(tr,prodref,ref,order.productorder_details,order.details.status !== "Completed")
                ids.push({merchandiseid: ref.id,id: uuidv4() })
            }else{
                ids.push({merchandiseid: order.productorder_details.id ,id: productorderid })
            }
        })   

        tr.set(current_order_ref,{
            notes: data.notes,
            expected_delivery_date: data.expected_delivery_date,
            orders: ids.map((d,key: number)=>{
                return {
                    id: d.id,
                    merchandiseid:d.merchandiseid,
                    details: data.orders[key].details,
                    product: data.orders[key].product 
                }
            })
        }) 

    })
    return current_order_ref.id

}

export default {
    GetProductOrderById,
    AddUpdateProductOrder
}