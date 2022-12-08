import * as admin from "firebase-admin"
import { DataError } from "../../lib/Error"

export const AddTokenToTable = async (token: string,orderid: string)=>{
    const db = admin.firestore()
    const order = db.doc("orders/"+orderid)
    await order.update({
        tokens: admin.firestore.FieldValue.arrayUnion(token)
    })
    return token
}
export const sendNotificationToOrder = async (data: any,orderid: string)=>{
    const db = admin.firestore()
    const messaging = admin.messaging()

    const order_ref = db.doc("orders/"+orderid)
    const order_snap = await order_ref.get()
    if(!order_snap.exists)
        throw new DataError("Order Not Found",{orderid: orderid})
    const order : any = {id: order_snap.id ,...order_snap.data()}
    const tokens = order.tokens
    const msgs = await messaging.sendMulticast({data : data,tokens: tokens})
    const toremove: string[] = []
    if(msgs.failureCount > 0){
        msgs.responses.forEach((res,index)=>{
            if(!res.success){
                toremove.push(tokens[index])
            }
        })
    }
    if(toremove.length > 0)
        await order_ref.update({
            tokens: admin.firestore.FieldValue.arrayRemove(...toremove)
        })
}
