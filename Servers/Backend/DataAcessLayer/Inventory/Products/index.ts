import * as admin from "firebase-admin"
import moment from "moment"
const GetProductById =  async (id: string)=>{
    const db = admin.firestore()
    const ref = db.doc("products/"+id)
    
    const res = await ref.get()
    if(!res.exists)
        throw Error("Invalid Product Id")

    return {id: ref.id,...res.data()}
}

const verifyId = (ing: any,productid: string)=>{
    if(ing && ing.products){            
        if(ing.products.filter((p: any)=>p.id === productid).length > 0){
            return false
        }else{
            let result: boolean = true
            ing.options.forEach((opt: any)=>{
                if(opt.type === 'check'){
                    result = result &&  verifyId(opt.ingredients,productid)
                }else if(opt.type === "select"){
                    opt.choices.forEach((choice: any)=>{
                        result = result &&  verifyId(choice.ingredients,productid)
                    })
                }
            })
            return result
        }
    }
    return true
}
const ConsumeProductItem = async (productid: string,data : {used:number,wasted: number})=>{

    const db = admin.firestore()

    const prodref = db.doc(`products/${productid}`)
                
    await db.runTransaction(async (tr)=>{
        const snap = await tr.get(prodref)
        const cur = snap.data()
        if(data.used + data.wasted > cur?.stockQuantity ){
            throw Error("Invalid Query,Exceeded maximum capacity")
        }
        tr.update(prodref,{
            stockQuantity: admin.firestore.FieldValue.increment(-(data.used + data.wasted))
        })
    })
}
const DeleteProduct =  async (productid: string)=>{
    const db = admin.firestore()
    const product_ref = db.doc('products/'+productid)
    const orders_ref = db.collection('products/'+productid+"/product_instances")
    const food_ref = db.collection('food')

    let allfood = await food_ref.get();

    allfood.forEach((item)=>{
        const food = item.data()
        if(!verifyId(food.ingredients,productid))
            throw Error("Product In Use In Food "+food.title)
    })

    const alldocs = await orders_ref.get()
    db.runTransaction(async (tr)=>{
        alldocs.forEach((element)=>{
            tr.delete(element.ref)
        })
        tr.delete(product_ref)
    })
}
const GetProducts = async (searchData: any)=>{
    const db = admin.firestore()
    let col = db.collection("products")
    const pagname = 'stockQuantity'
    let query  = col.orderBy(pagname,searchData.dir || 'desc');

    if(searchData.name)
        query = col.orderBy('name',searchData.dir || 'desc').where('name','>=',searchData.name)
    else{
    
        if(searchData.higherstockQuantity || searchData.lowerstockQuantity){
            query = query.orderBy('stockQuantity',searchData.dir || 'desc')
            
            if(searchData.higherstockQuantity)
                query = query.where('stockQuantity','>=',searchData.higherstockQuantity)
            if(searchData.lowerstockQuantity)
                query = query.where('stockQuantity','<=',searchData.lowerstockQuantity)
        }
    
        if(searchData.higherunitQuantity || searchData.lowerunitQuantity){
            query = query.orderBy('unitQuantity',searchData.dir || 'desc')
            
            if(searchData.higherunitQuantity)
                query = query.where('unitQuantity','>=',searchData.higherunitQuantity)
            if(searchData.lowerunitQuantity)
                query = query.where('unitQuantity','<=',searchData.lowerunitQuantity)
        }
    
    
        if(searchData.highersellingUnitPrice || searchData.lowersellingUnitPrice){
            query = query.orderBy('sellingUnitPrice',searchData.dir || 'desc')
            
            if(searchData.highersellingUnitPrice)
                query = query.where('sellingUnitPrice','>=',searchData.highersellingUnitPrice)
            if(searchData.lowersellingUnitPrice)
                query = query.where('sellingUnitPrice','<=',searchData.lowersellingUnitPrice)
        }
    }

    
    if(searchData.lastRef){
        const starting = await db.doc("products/"+searchData.lastRef).get()
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
const AddUpdateProduct = async (data: any,id: string | undefined)=>{
    const db = admin.firestore()
    if(data.unit.subunit){
        data.unitQuantity *= 1.0 * data.unit.subunit.ratio
    }
    if(id){
        const ref = db.doc('products/'+id)
        const productid = id+""
        const allfood_ref = db.collection("food") 
        const allfood_snap = await allfood_ref.get()
        const allfood = allfood_snap.docs.map((fd)=>{return {id: fd.id,...fd.data()}})
        allfood.forEach((fd)=>{
            updateFoodProducts(fd,data,productid)
        })
        await db.runTransaction(async tr =>{
            allfood.forEach((fd)=>{
                tr.update(db.doc("food/"+fd.id),fd)
            })
            tr.update(ref,data)
        })
        return productid
    }else{
        if(!data.stockQuantity)
            data.stockQuantity = 0
        const all_products =  db.collection('products')
        const snap = await all_products.add(data)
        return snap.id  
    }
}
export default {
    GetProductById,
    GetProducts,
    DeleteProduct,
    AddUpdateProduct ,
    ConsumeProductItem
}