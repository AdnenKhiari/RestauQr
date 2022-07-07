import { addDoc, collection, doc, getFirestore, writeBatch } from "firebase/firestore"

export const removeFromCart = (cart,setCart,cartid)=>{
    cart.splice(cart.findIndex(it => it.cartid === cartid),1)
    setCart([...cart])
}
export const getReducedCart = (ct)=>{
    const prev = []
    ct.forEach((cur)=>{
        const idx = prev.findIndex(it => it.cartid === cur.cartid)
        if(idx === -1){
            prev.push({...cur,count : 1})
        }else{
            const el = prev[idx]
            el.count = el.count +1
        }
    } ,[])
    return prev
}

export const populateMenu = ()=>{
    const allitems = {
        "Pizza" : [        
            {
                "title" : "Pizza Fruit de Mere",
                "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam et error, quisquam asperiores quibusdam laboriosam eaque animi veritatis aspernatur iste maiores omnis, molestiae labore voluptas in officia maxime. Repellendus, cumque!",
                "price": 16,
                "img" : "https://files.meilleurduchef.com/mdc/photo/recette/pizza-fruit-mer/pizza-fruit-mer-640.jpg"
                ,options: [
                    {
                        type: 'check',
                        price: 3,
                        msg: 'Double Fromage'
                    },{
                        type: 'check',
                        price: 6,
                        msg: 'Double Crevette'
                    },{
                        type: 'check',
                        price: 8,
                        msg: 'Crevette Royale'
                    },{
                        type: 'select',
                        msg: 'Taille',
                        choices:[{price: 0,msg: 'Mini'},{price: 4,msg: 'Moyenne'},{price: 8,msg: 'Large'},{price: 16,msg: 'XL'}]
                    }]
            },
            {
                "title" : "Pizza Naptune",
                "price": 6,
                "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam et error, quisquam asperiores quibusdam laboriosam eaque animi veritatis aspernatur iste maiores omnis, molestiae labore voluptas in officia maxime. Repellendus, cumque!",
                "img" : "https://img.cuisineaz.com/660x660/2021/07/28/i179970-pizza-neptune.webp",
                options: [
                    {
                        type: 'check',
                        price: 3,
                        msg: 'Double Fromage'
                    },{
                        type: 'check',
                        price: 2,
                        msg: 'Double Thon'
                    },{
                        type: 'select',
                        msg: 'Taille',
                        choices:[{price: 0,msg: 'Mini'},{price: 2,msg: 'Moyenne'},{price: 4,msg: 'Large'},{price: 8,msg: 'XL'}]
                    }]
            }
        ],
        "Pasta" :[        
            {
                "title" : "Spagheti Fruit de Mere",
                "price": 15,
                "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam et error, quisquam asperiores quibusdam laboriosam eaque animi veritatis aspernatur iste maiores omnis, molestiae labore voluptas in officia maxime. Repellendus, cumque!",
                "img" : "https://cuisine.nessma.tv/uploads/1/2019-07/b52156d9b600734ac1a6e5a75f070689.jpg"
                ,options: [
                    {
                        type: 'check',
                        price: 3,
                        msg: 'Fromage'
                    },{
                        type: 'select',
                        msg: 'Assiette',
                        choices:[{price: 0,msg: 'Normal'},{price: 8,msg: 'Grande'}]
                }]
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
                options: [
                {
                    type: 'select',
                    msg: 'Friture',
                    choices:[{price: 0,msg: 'Panne'},{price: 0,msg: 'Panné'}]
                }]
            }
        ],
        "Sandiwch Chaud":[        
            {
                "title" : "Sandiwch Viande",
                "price": 10,
                "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam et error, quisquam asperiores quibusdam laboriosam eaque animi veritatis aspernatur iste maiores omnis, molestiae labore voluptas in officia maxime. Repellendus, cumque!",
                "img" : "https://www.la-viande.fr/sites/default/files/inline-images/sandwich-roti-boeuf.jpg",
                options: [
                {
                    type: 'check',
                    price: 0,
                    msg: 'Harissa'
                },{
                    type: 'check',
                    price: 0,
                    msg: 'Mayo'
                },
                {
                    type: 'check',
                    price: 0,
                    msg: 'Salade Michwia'
                },{
                    type: 'check',
                    price: 3,
                    msg: 'Raclette'
                }]
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