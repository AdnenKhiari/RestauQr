import {GetByCategories} from "../../lib/FoodDal"
import GetAllCategories from "../../lib/GetCategories"
import Error from "../../components/Error"
import Loading from "../../components/Loading"
import DropDown from "react-dropdown"
import { useState } from "react"
import {useNavigate} from "react-router-dom"
import * as ROUTES from "../../ROUTES"

const AllFood = ()=>{
    const [cats,setCats] = useState([])
    const [selectedCat,setSelectedCat] = useState('')
    const allcategories = GetAllCategories()

    if(allcategories.error )
        return <Error msg={"Error while retrieving Categories information"} error={allcategories.error} />
    if(allcategories.loading )
        return <Loading />  
    return <div className="menu-container">
        <h1>Menu</h1>
        <div className="menu-content">
            <div className="menu-header">
                <div>
                    <button onClick={(e)=>{
                        //valid category
                        if(allcategories.result.indexOf(selectedCat) !== -1 && cats.indexOf(selectedCat) === -1 ){
                            setCats([...cats,selectedCat])
                        }
                    }}>Add Category</button>
                    <DropDown options={allcategories.result} onChange={(item)=>setSelectedCat(item.value)} />
                </div>  
                <div className="category-items">
                    {cats && cats.map((item,index)=><p key={index} className="category-item" onClick={(e)=>{
                        cats.splice(cats.indexOf(item),1)
                        setCats([...cats])
                    }} >{item}</p>)}
                </div>
            </div>
            <Menu categories={cats} />
        </div>

    </div> 
}
const Menu = ({categories})=>{
    const food_data = GetByCategories(categories)

    console.log(food_data)

    if( food_data.error)
        return <Error msg={"Error while retrieving Menu information"} error={food_data.error} />
    if( food_data.loading)
        return <Loading />
    return <div className="menu-items">
        {food_data && food_data.data.map((item,key)=><MenuItem key={key} food={item} />)}
    </div>
}

const MenuItem =({food})=>{
    const usenav = useNavigate()
    return <div className="menu-item" onClick={(e)=>usenav(ROUTES.FOOD.GET_REVIEW(food.id))}>
            <img src={food.img} alt={food.title}/>
            <p>{food.title}</p>
    </div>
}
export default AllFood