import * as admin from "firebase-admin"
const GetFoodById =  async (id: string)=>{
    const db = admin.firestore()
    const ref = db.doc("food/"+id)
    
    const res = await ref.get()
    if(!res.exists)
        throw Error("Invalid Id")

    return {id: ref.id,...res.data()}
}
const DeleteFoodById =  async (id: string)=>{
    const db = admin.firestore()
    const ref = db.doc("food/"+id)
    
    await ref.delete()
}
const GetFoods =  async (categories: string[])=>{
    const db = admin.firestore()
    let ref : FirebaseFirestore.CollectionReference | FirebaseFirestore.Query | null = null
    if(!categories || categories.length === 0)
        ref = db.collection("food")
    else 
        ref = db.collection("food").where('category','in',categories)

    const result = await ref?.get()
    return result.docs.map((fd)=>{return{id:fd.id ,...fd.data()}})
}


const AddUpdateFood = async (data: any,id: string | undefined)=>{
    const db = admin.firestore()
    var ref = null
    if(id){
        ref = db.doc('food/'+id)
        const foodid = id+""
        await ref.update(data)
        return ref.id
    }else{
        ref = db.collection('food')
        return (await ref.add(data)).id
    }

}

export default {
    GetFoodById,
    GetFoods,
    DeleteFoodById,
    AddUpdateFood
}