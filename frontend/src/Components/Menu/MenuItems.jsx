import { useState } from "react"
import { useEffect } from "react"
import {useNavigate} from "react-router-dom"
import * as ROUTES from "../../Routes/UI"

const allitems = {
    "Pizza" : [        
        {
            "id" : "03920329",
            "title" : "Pizza Fruit de Mere",
            "price": 10,
            "img" : "https://files.meilleurduchef.com/mdc/photo/recette/pizza-fruit-mer/pizza-fruit-mer-640.jpg"
        },
        {
            "id" : "03924429",
            "title" : "Pizza Naptune",
            "price": 10,

            "img" : "https://img.cuisineaz.com/660x660/2021/07/28/i179970-pizza-neptune.webp"
        }
    ],
    "Pasta" :[        
        {
            "id" : "03925529",
            "title" : "Spagheti Fruit de Mere",
            "price": 10,

            "img" : "https://cuisine.nessma.tv/uploads/1/2019-07/b52156d9b600734ac1a6e5a75f070689.jpg"
        }
    ],
    "Gratin" :[        
        {
            "id" : "03920429",
            "title" : "Gratin Dauphinois",
            "price": 10,
            "img" : "https://assets.afcdn.com/recipe/20201217/116563_w1024h768c1cx1116cy671.jpg"
        }
    ],
    "Plat" : [        
        {
            "id" : "03920349",
            "title" : "Plat Escalope",
            "price": 10,
            "img" : "https://linstant-m.tn/uploads/62c5358d61186dc6d994d3e2f50452c2afe7be75.jpg"
        }
    ],
    "Sandiwch Chaud":[        
        {
            "id" : "04920329",
            "title" : "Sandiwch Viande",
            "price": 10,
            "img" : "https://www.la-viande.fr/sites/default/files/inline-images/sandwich-roti-boeuf.jpg"
        }
    ],
    "Sandwich Froid" : [        
        {
            "id" : "03920329",
            "title" : "Sandwich Fromage",
            "price": 10,
            "img" : "https://img.cuisineaz.com/680x357/2016/06/01/i45456-sandwichs-gourmands-et-pratiques.jpg"
        }
    ],
    "Dessert" : [        
        {
            "id" : "03520329",
            "title" : "Tiramissu",
            "price": 10,
            "img" : "https://img-3.journaldesfemmes.fr/h3FeNDyqXnQJrPnFPKbOjzGx_UM=/748x499/smart/e2384d1c32d444528e8ec0881c4d632d/ccmcms-jdf/27162578.jpg"
        }
    ]
}
const GetMenuItems = (categories)=>{
    const [result,setResult] = useState([])
    useEffect(()=>{
        const res = []
        if(categories.length === 0)
            categories = Object.keys(allitems)
        categories.forEach(category => {
            allitems[category].forEach(food => res.push(food) )
        })
        setResult(res)
    },[categories])
    return result
}
const MenuItems = ({categories})=>{
    const menuData = GetMenuItems(categories)
    const usenav = useNavigate()
    return <div className="menu-items-container">
        {menuData.map((food,index) => <div key={index+100} className="food-item" onClick={()=>{
            usenav(ROUTES.GET_FOOD_DETAILS(food.id))
        }}>
           <img src={food.img} alt={food.title} />
             <div><p>  {food.title} </p> <p>{food.price}$</p></div>
        </div>)}
    </div> 
        
}

export default MenuItems 