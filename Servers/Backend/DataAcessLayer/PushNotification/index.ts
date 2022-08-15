import * as admin from "firebase-admin"

export const AddTokenToTable = async (token: string,orderid: string)=>{
    const db = admin.firestore()
    const order = db.doc("orders/"+orderid)
    await order.update({
        tokens: admin.firestore.FieldValue.arrayUnion(token)
    })
    return token
}