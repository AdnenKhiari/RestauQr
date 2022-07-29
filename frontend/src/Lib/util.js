import { addDoc, collection, doc, getFirestore, writeBatch } from "firebase/firestore"

export const RemoveFromCart = (order,setOrder,cartid)=>{
    const idx = order.cart.findIndex(it => it.cartid === cartid)
    if(idx === -1)
        return
    if(order.cart[idx].count >1)
        order.cart[idx].count-=1
    else
        order.cart.splice(idx,1)
    setOrder({...order})
}
export const getReducedCart = (ct)=>{
    /*const prev = []
    ct.forEach((cur)=>{
        const idx = prev.findIndex(it => it.cartid === cur.cartid)
        if(idx === -1){
            prev.push({...cur,count : 1})
        }else{
            const el = prev[idx]
            el.count = el.count +1
        }
    } ,[])*/
    return ct
}
export const prepareToHash = (options,parent = "")=>{
    let res = []
    options.forEach((item,index)=>{
        if(item.value){
            if(typeof(item.value) !== "boolean")
                item.name = item.value
            if(item.ingredients && item.ingredients.options )
                res = [...res,prepareToHash(item.ingredients.options,item.name)]
            else res.push(parent+"/"+item.name)
        }
    })
    return res
}
export const computePrice = (food,selections)=>{

    let price = food.price 
    if(food.ingredients && food.ingredients.options && selections)
        food.ingredients.options.forEach((opt,index)=>{
            if(selections[index].value){
                if(opt.type ==="select")
                    opt = opt.choices.find((ch) => ch.msg === selections[index].value)
                price += computePrice(opt,selections[index].options)
            }
        })
    return price

}
export const populateMenu = ()=>{
    const allitems = {
        "Pizza" : [        
            {
                "title" : "Pizza Fruit de Mere",
                "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam et error, quisquam asperiores quibusdam laboriosam eaque animi veritatis aspernatur iste maiores omnis, molestiae labore voluptas in officia maxime. Repellendus, cumque!",
                "price": 16,
                "img" : "https://files.meilleurduchef.com/mdc/photo/recette/pizza-fruit-mer/pizza-fruit-mer-640.jpg"

            },
            {
                "title" : "Pizza Naptune",
                "price": 6,
                "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam et error, quisquam asperiores quibusdam laboriosam eaque animi veritatis aspernatur iste maiores omnis, molestiae labore voluptas in officia maxime. Repellendus, cumque!",
                "img" : "https://img.cuisineaz.com/660x660/2021/07/28/i179970-pizza-neptune.webp",

            }
        ],
        "Pasta" :[        
            {
                "title" : "Spagheti Fruit de Mere",
                "price": 15,
                "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam et error, quisquam asperiores quibusdam laboriosam eaque animi veritatis aspernatur iste maiores omnis, molestiae labore voluptas in officia maxime. Repellendus, cumque!",
                "img" : "https://cuisine.nessma.tv/uploads/1/2019-07/b52156d9b600734ac1a6e5a75f070689.jpg"

            }
        ],
        "Gratin" :[        
            {
                "title" : "Gratin Dauphinois",
                "price": 10,
                "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam et error, quisquam asperiores quibusdam laboriosam eaque animi veritatis aspernatur iste maiores omnis, molestiae labore voluptas in officia maxime. Repellendus, cumque!",
                "img" : "https://assets.afcdn.com/recipe/20201217/116563_w1024h768c1cx1116cy671.jpg"
            }
        ],
        "Plat" : [        
            {
                "title" : "Plat Escalope",
                "price": 10,
                "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam et error, quisquam asperiores quibusdam laboriosam eaque animi veritatis aspernatur iste maiores omnis, molestiae labore voluptas in officia maxime. Repellendus, cumque!",
                "img" : "https://linstant-m.tn/uploads/62c5358d61186dc6d994d3e2f50452c2afe7be75.jpg",

            }
        ],
        "Sandiwch Chaud":[        
            {
                "title" : "Sandiwch Viande",
                "price": 10,
                "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam et error, quisquam asperiores quibusdam laboriosam eaque animi veritatis aspernatur iste maiores omnis, molestiae labore voluptas in officia maxime. Repellendus, cumque!",
                "img" : "https://www.la-viande.fr/sites/default/files/inline-images/sandwich-roti-boeuf.jpg",
            }
        ],
        "Sandwich Froid" : [        
            {
                "title" : "Sandwich Fromage",
                "price": 7,
                "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam et error, quisquam asperiores quibusdam laboriosam eaque animi veritatis aspernatur iste maiores omnis, molestiae labore voluptas in officia maxime. Repellendus, cumque!",
                "img" : "https://img.cuisineaz.com/680x357/2016/06/01/i45456-sandwichs-gourmands-et-pratiques.jpg"
            }
        ],
        "Dessert" : [        
            {
                "title" : "Tiramissu",
                "price": 4,
                "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam et error, quisquam asperiores quibusdam laboriosam eaque animi veritatis aspernatur iste maiores omnis, molestiae labore voluptas in officia maxime. Repellendus, cumque!",
                "img" : "https://img-3.journaldesfemmes.fr/h3FeNDyqXnQJrPnFPKbOjzGx_UM=/748x499/smart/e2384d1c32d444528e8ec0881c4d632d/ccmcms-jdf/27162578.jpg"
            }
        ]
    }
    const db = getFirestore()
    const foodcol = collection(db,'food')
    const batch = writeBatch(db)
    Object.keys(allitems).forEach((catkey)=>{
        allitems[catkey].forEach((food)=>{
            batch.set(doc(foodcol),{...food,category: catkey})
        })
    })
    batch.commit()
}