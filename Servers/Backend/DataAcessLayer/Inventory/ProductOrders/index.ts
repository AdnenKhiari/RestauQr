import * as admin from "firebase-admin"

const GetProductOrderById =  async (productid: string,orderid: string)=>{
    const db = admin.firestore()
    const ref = db.doc(`products/${productid}/product_orders/${orderid}`)
    
    const res = await ref.get()
    if(!res.exists)
        throw Error("Invalid ProductOrder Id")

    return {id: ref.id,...res.data()}
}

const DeleteProductOrder = async (productid: string,orderid: string)=>{
    let quan = 0
    const db = admin.firestore()

    const ref = db.doc('products/'+productid+'/product_orders/'+orderid)
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
const ConsumeProductOrder = async (productid: string,orderid: string,data: {wasted:number,used: number,updateGlobally : boolean}) => {
    const db = admin.firestore()

    const docref = db.doc(`products/${productid}/product_orders/${orderid}`)
    const prodref = db.doc(`products/${productid}`)
    await db.runTransaction(async (tr)=>{
        const snap = await tr.get(docref)
        if(!snap.exists){
            throw Error("Invalid IDs")
        }
        const cur = snap.data()
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
const GetProductOrders = async (searchData: any,productid: string | undefined)=>{
    const db = admin.firestore()
    const path = (productid ? 'products/' + productid+'/'  : '') + 'product_orders' 
    let col = productid ? db.collection( path) : db.collectionGroup('product_orders' )
    const pagname = 'time'
    let query  = col.orderBy(pagname,searchData.dir || 'desc');

    if(searchData.name)
        query = query.orderBy('name',searchData.dir || 'desc').where('name','>=',searchData.name)
    
    
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
        const starting = await db.doc(productid ? path+"/"+searchData.lastRef : "products/"+searchData.lastProductRef+"/product_orders/"+searchData.lastRef).get()
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
    return data.docs.map((order)=>{return{ id:order.id,...order.data()}})
}
const AddUpdateProductOrders = async (productid: string,orderid: string | undefined,data: any)=>{
    const db = admin.firestore()

    const prodref = db.doc('products/'+productid)

    if(orderid){
        const ref = db.doc('products/'+productid+'/product_orders/'+orderid)
        const productorderid = orderid+""
        await db.runTransaction(async (tr)=>{

            const old_prod = (await tr.get(prodref))
            if(!old_prod.exists)
                throw Error("Invalid Product Id")
            const old_prod_data = old_prod.data()

            const old_ord = (await tr.get(ref))
            if(!old_ord.exists)
                throw Error("Invalid Order Id")
            const old_ord_data = old_ord.data()

            const new_quantity = data.unitQuantity * data.productQuantity
            const old_quantity = old_ord_data?.unitQuantity * old_ord_data?.productQuantity
            const diff = new_quantity - old_quantity
            if(-diff > old_prod_data?.stockQuantity )
                throw Error("Exceeded maximum Capacity")
            tr.update(ref,data).update(prodref,{
                stockQuantity: admin.firestore.FieldValue.increment(diff)
            })
        })
        return productorderid
    }else{
        data = {...data,used: 0,wasted: 0}
        const stockadd =  (data.unitQuantity * data.productQuantity - (data.used + data.wasted))
        const ref = db.collection('products/'+productid+'/product_orders').doc()
        await db.runTransaction(async (tr)=>{
            tr.create(ref,data)
            tr.update(prodref,{stockQuantity: admin.firestore.FieldValue.increment(stockadd)})
        })
        return ref.id 
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
    GetProductOrderById,
    GetProductOrders,
    AddUpdateProductOrders,
    DeleteProductOrder,
    ConsumeProductOrder
}