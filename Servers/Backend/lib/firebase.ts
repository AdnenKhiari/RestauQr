const  ServiceAccount = require("../service-account.json")
import * as admin  from "firebase-admin"

export const InitFirebase = ()=>{

    const fb_app = admin.initializeApp({credential: admin.credential.cert(ServiceAccount)})
    const firestore = admin.firestore(fb_app)
    const storage = admin.storage(fb_app)

}