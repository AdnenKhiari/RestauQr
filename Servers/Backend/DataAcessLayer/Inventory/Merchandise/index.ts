import * as admin from "firebase-admin"

const GetMerchandiseById =  async (productid: string,orderid: string)=>{
    const db = admin.firestore()
    const ref = db.doc(`products/${productid}/product_instances/${orderid}`)
    
    const res = await ref.get()
    if(!res.exists)
        throw Error("Invalid ProductOrder Id")

    return {id: ref.id,...res.data()}
}

const DeleteMerchandise = async (productid: string,orderid: string)=>{
    let quan = 0
    const db = admin.firestore()

    const ref = db.doc('products/'+productid+'/product_instances/'+orderid)
    db.runTransaction(async (tr)=>{
        const snap = await tr.get(ref)
        if(!snap.exists)
            throw Error("Invalid Product Order Id")
        const data = snap.data()
        quan = data?.unitQuantity * data?.productQuantity - (data?.used + data?.wasted)
        tr.delete(ref).update(db.doc('products/'+productid),{
            stockQuantity: admin.firestore.FieldValue.increment(-quan)
        })
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
            await updatemerchandise(tr,prodref,ref,data,undefined)
        })
        return productorderid
    }else{
        const ref = db.collection('products/'+productid+'/product_instances').doc()
        await db.runTransaction(async (tr)=>{
            addmerchandise(tr,prodref,ref,data,isdisabled)
        })
        return ref.id 
    }
}

export const addmerchandise = (tr: FirebaseFirestore.Transaction,prodref: FirebaseFirestore.DocumentReference<any>,ref: FirebaseFirestore.DocumentReference<any>,data: any,isdisabled: boolean)=>{
    data = {...data,used: 0,wasted: 0}
    //for data update
    data.disabled = isdisabled
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