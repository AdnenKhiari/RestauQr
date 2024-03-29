import * as admin from "firebase-admin"
import moment from "moment"
import { DataError } from "../../lib/Error"




const GetCurrentOrderInTable = async (tableid: string)=>{
    const db = admin.firestore()
    const current_ref = db.collection('orders').where('status',"==","unpaid").where('tableid','==',tableid)
    const current = await current_ref.get()
    if(current.docs.length === 0){
        return {order: null,suborders: []}
    }else{
        const order_ref = current.docs[0]
        const order = {id: order_ref.id,...order_ref.data()}
        const sub_ref = db.collection("orders/"+order.id+"/sub_orders")
        const sub_orders_snaps = await sub_ref.get()
        const sub_orders = sub_orders_snaps.docs.map((snap)=>{
           return {id: snap.id,...snap.data()}
        }) || []
        return {order,sub_orders: sub_orders}
    }
}
const RemoveClientSubOrder = async (orderid: string,subid: string)=>{
    const db = admin.firestore()
    let toremove = false
    await db.runTransaction(async tr =>{
        const order_ref = db.doc('orders/'+orderid)
        const sub_ref = db.doc('orders/'+orderid+"/sub_orders/"+subid)
        const sub_snap = await tr.get(sub_ref)
        const order_snap = await tr.get(order_ref)
        if(!order_snap.exists)
            throw new DataError("Order Not Found",{subid: subid,orderid: orderid})
        if(!sub_snap.exists)
            throw new DataError("SubOrder Not Found",{subid: subid,orderid: orderid})

        const current_data = sub_snap.data()
        const status = current_data?.status
        const oldprice = current_data?.price
        if(status !== "waiting")
            throw new DataError("Request Already Processing / processed , Cannot Delete",{subid: subid,orderid: orderid})
        tr.delete(sub_ref)

        const order = order_snap.data()
        if(order?.price > oldprice){
            tr.update(order_ref,{
                price: admin.firestore.FieldValue.increment(-oldprice),
                foodcount: admin.firestore.FieldValue.increment(-current_data?.food.reduce((init: number,fd: any)=>fd.count + init,0))
            })
        }else{
            tr.delete(order_ref)
            toremove = true
        }
    })
    return toremove
}
const AddUpdateClientSubOrder = async (order: any,cartitem: any) => {
    const db = admin.firestore()

        let sub_doc : admin.firestore.DocumentReference<admin.firestore.DocumentData>  | null = null
        let sub_id = ''
        let order_doc = db.collection('orders').doc()
        await db.runTransaction(async tr =>{
            if(!order.id){
                tr.set(order_doc,{
                    status: "unpaid",
                    tableid : parseInt(order.tableid),
                    time: new Date(),
                    price: 0,
                    foodcount: 0
                })
            }else{
                order_doc = db.doc("orders/"+order.id)
            }
            
            const suborders_col = db.collection('orders/'+order_doc.id+"/sub_orders")
            if(!cartitem.id){
                sub_doc = suborders_col.doc()
                tr.create(sub_doc,{
                    food: cartitem.food,   
                    // TO CHANGE NOT SECURE RED FLAG 
                    price: cartitem.price,
                    time: new Date(),
                    status: "waiting",
                    tableid: order.tableid,
                    order_ref: order_doc.id
                }).update(order_doc,{
                    price:  admin.firestore.FieldValue.increment(cartitem.price),
                    foodcount: admin.firestore.FieldValue.increment(cartitem.food.reduce((init: number,fd: any)=>fd.count + init,0))
                })
                sub_id = sub_doc.id
            }else{
                sub_doc = db.doc('orders/'+order_doc.id+"/sub_orders/"+cartitem.id)
                const old = await tr.get(sub_doc)
                if(!old.exists)
                    throw new DataError("Invalid SubOrder Id",{subid: sub_doc.id})
                const old_pr = old.data()
                const oldprice = old_pr?.price

                if(old.data()?.status === "waiting"){
                    tr.update(sub_doc,{
                        food: cartitem.food,
                        // DANGEROUS TO CHANGE
                        price: cartitem.price
                    })
                    tr.update(order_doc,{
                        price: admin.firestore.FieldValue.increment(cartitem.price - oldprice),
                        foodcount: admin.firestore.FieldValue.increment(-old_pr?.food.reduce((init: 0,fd: any)=>fd.count + init,0) + cartitem.food.reduce((init:number,fd: any)=>fd.count + init,0))
                    })
                }else{
                    throw new DataError("Order Completed , Cannor Remove Data",{subid: sub_doc.id})
                }
                sub_id = sub_doc.id
            }
        })
        return {id: order_doc.id,sub_id: sub_id }
}
const GetOrderById =  async (id: string)=>{
    const db = admin.firestore()
    const ref = db.doc("orders/"+id)
    
    const res = await ref.get()
    if(!res.exists)
    throw new DataError("Order Not Found",{orderid: id})
    return {id: ref.id,...res.data()}
}
const GetSubOrderById =  async (orderid: string,subid :string)=>{
    const db = admin.firestore()
    const ref = db.doc(`orders/${orderid}/sub_orders/${subid}`)
    const res = await ref.get()
    if(!res.exists)
        throw new DataError("SubOrder Not Found",{orderid: orderid,subid: subid})
    return {id: ref.id,...res.data()}
}

const DeleteOrderById =  async (id: string)=>{
    const db = admin.firestore()
    
    const sub_ref = db.collection("orders/"+id+"/sub_orders")
    const sub_content = await sub_ref.get()
    if(sub_content.docs.some((dt)=>dt.data().status !== 'waiting'))
        throw new DataError("Some SubOrders Are still processing / processed",{orderid: id})
    await db.runTransaction(async (tr)=>{
        const ref = db.doc("orders/"+id)
        sub_content.docs.forEach((element)=>{
            const sub_ref = element.ref
            tr.delete(sub_ref)
        })
        tr.delete(ref)
    })      
}

const DeleteSubOrderById =  async (orderid: string,subid: string)=>{
    const db = admin.firestore()
    const ref = db.doc(`orders/${orderid}/sub_orders/${subid}`)
    const order_ref = db.doc(`orders/${orderid}`)
    await db.runTransaction(async tr=>{
        const order_snap = await order_ref.get()
        if(!order_snap.exists)
        throw new DataError("Order Not Found",{orderid: orderid,subid: subid})
        const order : any= {id: order_snap.id,...order_snap.data()}
        const sub_snap = await tr.get(ref)
        if(!sub_snap.exists)
        throw new DataError("SubOrder Not Found",{orderid: orderid,subid: subid})
        if(sub_snap.data()?.status !== 'waiting')
            throw new DataError("Order Is currently being processed or has been processed",{orderid: orderid,subid: subid})
        tr.delete(ref)
        const old_sub = sub_snap.data()
        if(order?.price > old_sub?.price){
            tr.update(order_ref,{
                price: admin.firestore.FieldValue.increment(-old_sub?.price),
                foodcount: admin.firestore.FieldValue.increment(-old_sub?.food.reduce((init: number,fd: any)=>fd.count + init,0))
            })
            return false
        }else{
            tr.delete(order_ref)
            return true
        }
    })
}

const GetOrders =  async (searchData: any)=>{
    const db = admin.firestore()
    let col = db.collection("orders")
    const pagname = 'time'
    let query  = col.orderBy(pagname,searchData.dir || 'desc');

    if(searchData.startDate)
        query = query.where('time','>=',(moment(searchData.startDate).toDate()))
    if(searchData.tableid)
        query = query.where('tableid','==',parseInt(searchData.tableid))
    if(searchData.endDate)
        query = query.where('time','<=',(moment(searchData.endDate).toDate()))
    
    if(searchData.lastRef){
        const starting = await db.doc("orders/"+searchData.lastRef).get()
        if(!starting.exists)
        throw new DataError("Invalid Reference",searchData)
        if(searchData.swapped)
            query = query.startAt(starting)
        else
            query = query.startAfter(starting)

    }
    query = query.limit(10)
    const data = await query.get()
    return data.docs.map((order)=>{return{ id:order.id,...order.data()}})
}
const GetSubOrders =  async (orderid: string | undefined,searchData: any)=>{
    const path = orderid ? "orders/"+orderid+"/sub_orders" : "sub_orders"
    const db = admin.firestore()
    let col = orderid ? db.collection(path) : db.collectionGroup(path)
    const pagname = 'time'
    let query  = col.orderBy(pagname,searchData.dir || 'desc');

    if(searchData.startDate)
        query = query.where('time','>=',(moment(searchData.startDate).toDate()))
    if(searchData.tableid)
        query = query.where('tableid','==',(searchData.tableid))
    if(searchData.endDate)
        query = query.where('time','<=',(moment(searchData.endDate).toDate()))
    if(searchData.status)
        query = query.where('status','==',(searchData.status))
    if(searchData.lastRef){
        const starting = await db.doc(orderid ? path+"/"+searchData.lastRef : "orders/"+searchData.lastOrderRef+"/sub_orders/"+searchData.lastRef ).get()
        if(!starting.exists)
        throw new DataError("Invalid Reference",searchData)
        if(searchData.swapped)
            query = query.startAt(starting)
        else
            query = query.startAfter(starting)

    }
    query = query.limit(2)
    const data = await query.get()
    return data.docs.map((order)=>{return{ id:order.id,...order.data()}})
}

const UpdateOrder = async (orderid:string,data: any)=>{
    const db = admin.firestore()
    const all_subs = db.collection('orders/'+orderid+'/sub_orders')
    const all_data = await all_subs.get()
    console.log(all_data.docs.map((val)=>val.data()))

    if(data.status === 'paid' && (all_data.docs.length !== 0 && all_data.docs.map((item)=>item.data()).some(item=>item.status !== "accomplished" && item.status !== 'canceled')))
        throw new DataError("SubOrders Are Not Valiated Correctly",{orderid: orderid})

    await db.runTransaction(async tr=>{
        const current_order_ref = db.doc('orders/'+orderid)
        const pr = await current_order_ref.get()
        if(!pr.exists)
        throw new DataError("Order Not Found",{orderid: orderid})

        tr.update(current_order_ref,{
            status: data.status
        })

        if(data.status === 'paid'){
           /* tr.set(today_stats,{
                orders: increment(1),
                success: increment(1),
                total: increment(pr_dt.price),
                date: new Date(),
                events: arrayUnion({
                    date: new Date(),
                    foodcount: pr_dt.foodcount
                })
            },{merge: true})
            */
        }
    })
}

const computeUsage = (fd: any,selectedopts: any,hs: any,count: number)=>{
//    console.log("Hi i'm",fd,"and explrong",selectedopts,"with",hs,"coundt",count)
    if(fd.products){
        fd.products.forEach((prd: any)=>{
            if(!hs[prd.id])
                hs[prd.id] = 0
            hs[prd.id] += prd.quantity * count
        })
    }
    if(fd.options)
        fd.options.forEach((opt: any)=>{
            let selected : any = null
            if(opt.type === 'select'){
                selected = opt.choices.find((choice: any) => selectedopts && selectedopts.find((d : any)=> d.value === choice.msg) !== undefined)               
                selected = selectedopts && selectedopts.find((d : any) => d.value === selected.msg)
                opt = opt.choices.find((c: any) => c.msg === selected.value)
            } else{
                selected = selectedopts && selectedopts.find((d : any) => d.name === opt.msg)
            }     
            //console.log("currently",opt,"Seraching for my option and found",selected)
        
            const valid = selected && selected.value
            if(opt.ingredients && valid){   
                console.log("Valid ",selected)
                computeUsage(opt.ingredients,selected.ingredients ? selected.ingredients.options : [],hs,count)
            }
        })
}

const UpdateSubOrder = async (orderid: string,subid: string,data: any)=>{
    const db = admin.firestore()
    const current_reference = db.doc('orders/'+orderid+'/sub_orders/'+subid)
    const current_order_r = await current_reference.get()
    if(!current_order_r.exists)
        throw new DataError("Order Not Found",{orderid: orderid,subid: subid})

    const current_order : any = {id : current_order_r.id,...current_order_r.data()}

    if(current_order.status === data.status && !data.reason)
        return;

    const cur_ord = db.doc('orders/'+orderid)
    const order_snap = await cur_ord.get()
    if(!order_snap)
        throw new DataError("Order Not Found",{orderid: orderid,subid: subid})
    const order : any = {id: order_snap.id,...order_snap.data()}

    //For Update the sub order
    const dt = {
        status: data.status,
        reason: data.reason || admin.firestore.FieldValue.delete()   
    }

    //Ingredients Update
    const del = current_order.status === "accomplished" && data.status === "canceled"
    const add  = current_order.status === "pending" && data.status === "accomplished"
    const usage: any = {}
    if(add || del)
        current_order.food.forEach((fd: any)=>{
            if(fd.ingredients)
                computeUsage(fd.ingredients,fd.options,usage,fd.count)
        })
    //const global_stats_ref = db.collection('global_stats')
   // const today_stats = doc(global_stats_ref,getTodayDate())
    const suborder_ref = db.doc(`orders/${orderid}/sub_orders/${subid}`)

    await db.runTransaction(async tr =>{

        tr.update(suborder_ref,dt)
        if(data.status === 'canceled' && current_order.status !== "canceled"){
            if(current_order.price > order?.price){
                tr.update(cur_ord,{
                    price: admin.firestore.FieldValue.increment(-current_order.price),
                    foodcount: admin.firestore.FieldValue.increment(-current_order?.food.reduce((init: number,fd: any)=>init+fd.count,0))
                })
            }else{

                tr.update(cur_ord,{
                    price: admin.firestore.FieldValue.increment(-current_order.price),
                    foodcount: 0,
                    status: 'canceled'
                })
                // Decrease the stats cause of canceled order
            /* tr.set(today_stats,{
                    success: increment(-1),
                    canceled: increment(1),
                    total: increment(-current.price),
                },{merge: true})*/
            }
        }

        if(add || del){
            console.log("LOGGING",usage)
            Object.keys(usage).forEach((id)=>{
                console.log("I'm at",usage[id])
                const products_ref = db.doc('products/'+id)
                //const stat_ref =  db.doc(db,'products/'+id+'/orders_stats/'),getTodayDate())

                if(add){
                    tr.update(products_ref,{
                        stockQuantity:  admin.firestore.FieldValue.increment(-usage[id])
                    })
                /* tr.set(stat_ref,{
                        used: admin.firestore.FieldValue.increment(usage[id])
                    },{merge: true})*/
                }
                /*if(del){
                    tr.set(stat_ref,{
                        used: admin.firestore.FieldValue.increment(-usage[id]),
                        wasted: admin.firestore.FieldValue.increment(usage[id])
                    },{merge: true})    
                }*/
            })
        }
    })
}


export default {
    GetOrderById,
    GetSubOrderById,
    UpdateSubOrder,
    UpdateOrder,
    DeleteOrderById,
    DeleteSubOrderById,
    GetOrders,
    GetSubOrders,
    AddUpdateClientSubOrder,
    RemoveClientSubOrder,
    GetCurrentOrderInTable
}