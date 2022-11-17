import * as admin from "firebase-admin"
import moment from "moment"
import { addmerchandise, processremovemerchandise, updatemerchandise } from "../../Inventory/Merchandise"
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
    const allorders = productorders.orders.length > 0 ? await db.getAll(...productorders.orders.map((order: any,key: number)=>{
        return db.doc('products/'+order.product+'/product_instances/'+order.merchandiseid)
    })) : []
    
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
const DeleteProductOrder =  async (supplierid: string,id: string)=>{
    const db = admin.firestore()
    const path = 'suppliers/'+supplierid+"/productorders/"
    const current_order_ref = id ? db.doc(path+id) : db.collection(path).doc() 
    await db.runTransaction(async tr=>{
        const current_order_snap = await tr.get(current_order_ref)
        if(!current_order_snap.exists)
            throw Error("Invalid Id")
        const current_order : any = current_order_snap.data()
        const to_remove_merchandise_snaps = current_order.orders.length > 0 ? await tr.getAll(...current_order.orders.map((od : any)=> db.doc('products/'+od.product+"/product_instances/"+od.merchandiseid) )): []

        await Promise.all(to_remove_merchandise_snaps.map(async (mer,key: number)=>{
            const current_mer = mer.data()
            const curr_order = current_order.orders[key]
            processremovemerchandise(current_mer,tr,db.doc("products/"+curr_order.product))
            tr.delete(mer.ref)
        }))
        tr.delete(current_order_ref)
    })
}

const GetProductOrders = async (params : any = {},supplierid : string  | undefined)=>{
    const db = admin.firestore()
    const ref = supplierid ?  db.collection("/suppliers/"+supplierid+"/productorders") : db.collectionGroup("productorders") 
    const query = ref.limit(10)
    const snaps = await query.get()
    return snaps.docs.map((snap)=>{
        const data = snap.data()
        const all_status : string[] = data.orders.map((ord: any)=>ord.details.status)
        return {
            id: snap.id,
            creation_date: data.creation_date,
            expected_delivery_date : data.expected_delivery_date,
            notes : data.notes,
            productid: data.product_instances,
            supplierid: snap.ref.parent.parent?.id,
            status: all_status.every((st)=> st === "Canceled") ? "Canceled" : all_status.every((st)=> st === "Completed") ? "Completed" : all_status.every((st)=> st === "Waiting") ? "Waiting" : "Other"
        }
    })
}

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

                const to_remove = current_order.orders.filter((ord : any) => data.orders.findIndex((d : any) => d.id === ord.id) === -1)
                const to_remove_merchandise_snaps = to_remove.length > 0 ? await tr.getAll(...to_remove.map((od : any)=> db.doc('products/'+od.product+"/product_instances/"+od.merchandiseid) )): []
                const to_update_snaps = to_update.length > 0 ? await tr.getAll(...to_update.map((order: any)=>db.doc('products/'+order.product+"/product_instances/"+order.productorder_details.id))) : []

                // first clean the corresponding products stock then remove the merchandise
                if(to_remove_merchandise_snaps.length > 0){
                    await Promise.all(to_remove_merchandise_snaps.map(async (mer,key: number)=>{
                        const current_mer = mer.data()
                        const curr_order = to_remove[key]
                        processremovemerchandise(current_mer,tr,db.doc("products/"+curr_order.product))
                        tr.delete(mer.ref)
                    }))
                }
                //to make sure you can update the status and the quantities 
                if(to_update.length > 0){
                    await Promise.all(to_update_snaps.map(async (dl,key: number)=>{
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
                    })) 
                }
            }
    
            data.orders.forEach((order: any,key: number)=>{
                const productorderid = order.id
                const prodref = db.doc('products/'+order.product)
                if(!productorderid){
                    const new_id = uuidv4()
                    const ref = db.collection('products/'+order.product+'/product_instances/').doc()
                    addmerchandise(tr,prodref,ref,order.productorder_details,order.details.status !== "Completed",supplierid,current_order_ref.id,new_id)
                    ids.push({merchandiseid: ref.id,id: new_id})
                }else{
                    ids.push({merchandiseid: order.productorder_details.id ,id: productorderid })
                }
            })  
            const data_to_add : any = {
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
            } 
            if(!id)
                data_to_add.creation_date = new Date()
            tr.set(current_order_ref,data_to_add,{merge: true}) 
       
    })

    return current_order_ref.id

}

export default {
    GetProductOrderById,
    AddUpdateProductOrder,
    DeleteProductOrder,
    GetProductOrders
}