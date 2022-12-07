import * as admin from "firebase-admin"
import { firestore } from "firebase-admin"
import joi from "joi"
const merchandiseSchema = (custom_fields : any)=>{
    const arr : any = {
        id: joi.string().optional().label('Item Id'),
        name: joi.string().required().label('Item Name'),
        productQuantity: joi.number().min(0).required().label('Item Quantity :'),
        unitQuantity: joi.number().required().label('Quantity/U'),
        unitPrice: joi.number().min(0).required().label('Price/U'),
        expiresIn: joi.date().required().label('Expires In'),
    }
    custom_fields.forEach((key: any)=>{
        if(key.type === "short-text")
            arr[key.name] = joi.string().allow("").required().label(key.label)
        if(key.type === "long-text")
            arr[key.name] = joi.string().allow("").required().label(key.label)
        if(key.type === "decimal")
            arr[key.name] = joi.number().allow("").required().label(key.label)
        if(key.type === "date")
            arr[key.name] = joi.date().allow("").required().label(key.label)
        if(key.type === "date-time")
            arr[key.name] =joi.date().allow("").required().label(key.label)
        if(key.type === "select")
            arr[key.name] =joi.string().valid(...key.choices,"").required().label(key.label)
        if(key.type === "list-select")
            arr[key.name] =joi.array().items(joi.string().valid(...key.choices).optional()).required().label(key.label)
    })
    return  joi.object(arr)
}

const GetMerchandiseById =  async (productid: string,orderid: string)=>{
    const db = admin.firestore()
    const ref = db.doc(`products/${productid}/product_instances/${orderid}`)
    
    const res = await ref.get()
    if(!res.exists)
        throw Error("Invalid ProductOrder Id")

    return {id: ref.id,...res.data()}
}

const DeleteMerchandise = async (productid: string,orderid: string)=>{
    const db = admin.firestore()

    const ref = db.doc('products/'+productid+'/product_instances/'+orderid)
    db.runTransaction(async (tr)=>{
        const snap = await tr.get(ref)
        if(!snap.exists)
            throw Error("Invalid Product Order Id")
        const data = snap.data()

        if(data?.productorder_id && data?.supplier_id  && data?.order_id){
            const productorder_ref = db.doc(`/suppliers/${data?.supplier_id}/productorders/${data?.productorder_id}`)
            const productorder_snap = await tr.get(productorder_ref)
            if(!productorder_snap.exists)
                throw Error("Product Order Do Not Exists")
            const productorder_data  = productorder_snap.data()      
            const to_remove = productorder_data?.orders.findIndex((pd: any) => pd.id === data.order_id)
            if(to_remove !== -1)
                productorder_data?.orders.splice(to_remove)
            if(productorder_data?.orders.length > 0)
                tr.update(productorder_ref,productorder_data)
            else 
                tr.delete(productorder_ref)
        }
        //updates the product quantity before removing the merchandise
        processremovemerchandise(data,tr,db.doc("/products/"+productid))
        tr.delete(ref)

    })
}
export const processremovemerchandise = (data: any,tr: firestore.Transaction,ref: firestore.DocumentReference<firestore.DocumentData>)=>{
    const quan = data?.unitQuantity * data?.productQuantity - (data?.used + data?.wasted)
    if(!data?.disabled)
        tr.update(ref,{
            stockQuantity: admin.firestore.FieldValue.increment(-quan)
        })
}

const ConsumeMerchandise= async (productid: string,orderid: string,data: {wasted:number,used: number,updateGlobally : boolean}) => {
    const db = admin.firestore()

    const docref = db.doc(`products/${productid}/product_instances/${orderid}`)
    const prodref = db.doc(`products/${productid}`)
    await db.runTransaction(async (tr)=>{
        const snap = await tr.get(docref)
        if(!snap.exists){
            throw Error("Invalid IDs")
        }
        const cur = snap.data()
        if(cur?.disabled)
            throw Error("Item Disabled !")
        if(cur?.used + data.used < 0 || cur?.wasted + data?.wasted < 0){
            throw Error("Invalid Query,the wasted and used total ammounts cannot be negative")
        }
        if(cur?.used + data.used + cur?.wasted + data.wasted  > cur?.productQuantity * cur?.unitQuantity){
            throw Error("Invalid Query,Exceeded maximum capacity")
        }
        tr.update(docref,{
            used: admin.firestore.FieldValue.increment(data.used),
            wasted: admin.firestore.FieldValue.increment(data.wasted),
        })
        if(data.updateGlobally)
            tr.update(prodref,{
                stockQuantity: admin.firestore.FieldValue.increment(-(data.used + data.wasted))
            })
    })
}
const GetMerchandise = async (searchData: any,productid: string | undefined)=>{
    const db = admin.firestore()
    const path = (productid ? 'products/' + productid+'/'  : '') + 'product_instances' 
    let col = productid ? db.collection( path) : db.collectionGroup('product_instances' )
    const pagname = 'time'
    let query :  admin.firestore.Query<admin.firestore.DocumentData> = col

    if(searchData.name)
        query = query.orderBy('name',searchData.dir || 'desc').where('name','>=',searchData.name)
    
    if(searchData.order_ref)
        query = query.orderBy(pagname,searchData.dir || 'desc').where("order_ref",'==',searchData.order_ref)
        
    if(searchData.higherexpiresIn || searchData.lowerexpiresIn){
        query = query.orderBy('expiresIn',searchData.dir || 'desc')
        
        if(searchData.higherexpiresIn)
            query = query.where('expiresIn','>=',searchData.higherexpiresIn)
        if(searchData.lowerexpiresIn)
            query = query.where('expiresIn','<=',searchData.lowerexpiresIn)
    }

    if(searchData.highertime || searchData.lowertime){
        query = query.orderBy('time',searchData.dir || 'desc')
        
        if(searchData.highertime)
            query = query.where('time','>=',searchData.highertime)
        if(searchData.lowertime)
            query = query.where('time','<=',searchData.lowertime)
    }

    if(searchData.lastRef){
        const starting = await db.doc(productid ? path+"/"+searchData.lastRef : "products/"+searchData.lastProductRef+"/product_instances/"+searchData.lastRef).get()
        if(!starting.exists)
            throw Error("Invalid Last Reference")
        if(searchData.swapped)
            query = query.startAt(starting)
        else
            query = query.startAfter(starting)

    }

    
    query = query.limit(2)
    const data = await query.get()
    console.log(data.docs)
    return data.docs.map((order)=>{return{ id:order.id,product_ref: order.ref.parent?.parent?.id,...order.data()}})
}
const AddUpdateMerchandise = async (productid: string,orderid: string | undefined,data: any,isdisabled: boolean = false)=>{
    
    const db = admin.firestore()
    const prodref = db.doc('products/'+productid)



    
    if(orderid){
        const ref = db.doc('products/'+productid+'/product_instances/'+orderid)
        const productorderid = orderid+""
        await db.runTransaction(async (tr)=>{
            const value = verify_merchandise(tr,data,prodref)
            await updatemerchandise(tr,prodref,ref,data,undefined)
        })
        return productorderid
    }else{
        const ref = db.collection('products/'+productid+'/product_instances').doc()
        await db.runTransaction(async (tr)=>{
            const value = verify_merchandise(tr,data,prodref)
            addmerchandise(tr,prodref,ref,data,isdisabled,undefined,undefined,undefined)
        })
        return ref.id 
    }
}
const verify_merchandise = async (tr: FirebaseFirestore.Transaction,data: any,prodref: FirebaseFirestore.DocumentReference<any>)=>{
    const product_snap = await tr.get(prodref)
    if(!product_snap.exists)
        throw Error("Invalid product Id")
    const product : any = {...product_snap.data(),id: product_snap.id}
    const schema = merchandiseSchema(product?.template?.custom_fields)
    const {value,error}  = schema.validate(data)
    if(error)
        throw error
    console.log(value)
    return value
}
export const addmerchandise = (tr: FirebaseFirestore.Transaction,prodref: FirebaseFirestore.DocumentReference<any>,ref: FirebaseFirestore.DocumentReference<any>,data: any,isdisabled: boolean,supplierid: string | undefined,productorderid: string | undefined,order_id: string | undefined)=>{
    data = {...data,used: 0,wasted: 0}
    //for data update
    data.disabled = isdisabled
    if(productorderid && supplierid && order_id)
        data.productorder_id = productorderid
        data.supplier_id = supplierid
        data.order_id = order_id
    const stockadd = (data.unitQuantity * data.productQuantity - (data.used + data.wasted))
    tr.create(ref,data)
    if(!isdisabled)
        tr.update(prodref,{stockQuantity: admin.firestore.FieldValue.increment(stockadd)})
}
export const updatemerchandise = async (tr: FirebaseFirestore.Transaction,prodref: FirebaseFirestore.DocumentReference<any>,ref: FirebaseFirestore.DocumentReference<any>,data: any,isdisabled: undefined | boolean)=>{
    const stockadd = (data.unitQuantity * data.productQuantity - (data.used + data.wasted))
    //for data update
    if(isdisabled !== undefined)
        data.disabled = isdisabled
    const old_prod = (await tr.get(prodref))
    if(!old_prod.exists)
        throw Error("Invalid Product Id")
    const old_prod_data = old_prod.data()

    const old_ord = (await tr.get(ref))
    if(!old_ord.exists)
        throw Error("Invalid Order Id")
    const old_ord_data = old_ord.data()

    if(isdisabled === undefined)
        isdisabled = old_ord_data?.disabled

    if(!old_ord_data?.disabled && isdisabled)
        throw Error("Invalid Status Change")

    if(!old_ord_data?.disabled && !isdisabled){
        //update the quantities 
        const new_quantity = data.unitQuantity * data.productQuantity
        const old_quantity = old_ord_data?.unitQuantity * old_ord_data?.productQuantity
        const diff = new_quantity - old_quantity
        if(-diff > old_prod_data?.stockQuantity )
            throw Error("Exceeded maximum Capacity")
        tr.update(prodref,{
            stockQuantity: admin.firestore.FieldValue.increment(diff)
        })
    }

    //update the data
    tr.update(ref,data)

    if(old_ord_data?.disabled && !isdisabled){
        //add quantity to product
        tr.update(prodref,{stockQuantity: admin.firestore.FieldValue.increment(stockadd)})
    }

    return ref.id
}

const updateFoodProducts = (cur: any,data: any,productid :any)=>{
    if(cur.ingredients){
            if(cur.ingredients.products)
            cur.ingredients.products.forEach((prod: any)=>{
                if(prod.id.trim() === productid.trim()){
                    prod.name = data.name
                    prod.sellingUnitPrice = data.sellingUnitPrice
                    prod.unit = data.unit
                    prod.unitQuantity = data.unitQuantity
                }
            })
            if(cur.ingredients.options)
            cur.ingredients.options.forEach((opt: any)=>{
                if(opt.type==="select"){
                    opt.choices.forEach((select: any)=>{
                       // console.log("Select",select)
                       updateFoodProducts(select,data,productid)
                    })
                }else{
                   // console.log("Check",opt)
                   updateFoodProducts(opt,data,productid)   
                }
            })
    } 
}


export default {
    GetMerchandiseById,
    GetMerchandise,
    AddUpdateMerchandise,
    DeleteMerchandise,
    ConsumeMerchandise
}