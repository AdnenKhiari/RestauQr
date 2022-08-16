import {GetByCategories} from "../../lib/FoodDal"
import {GetCategories} from "../../lib/Categories"
import Error from "../../components/Error"
import Loading from "../../components/Loading"
import DropDown from "react-dropdown"
import { useState } from "react"
import {useNavigate} from "react-router-dom"
import * as ROUTES from "../../ROUTES"
import {motion} from "framer-motion"
import {FadeIn,staggerChildren,TranslateIn} from "../../animations"
import { useEffect } from "react"
import { useCallback } from "react"
const AllFood = ()=>{
    const [cats,setCats] = useState([])
    const [selectedCat,setSelectedCat] = useState('')
    const allcategories = GetCategories()

    if(allcategories.error )
        return <Error msg={"Error while retrieving Categories information"} error={allcategories.error} />
    if(allcategories.loading )
        return <Loading />  
    return <motion.div variants={FadeIn()} className="menu-container" >
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
            <Menu categories={allcategories.result} selectedCat={cats}/>
        </div>

    </motion.div> 
}
const Menu = ({categories,selectedCat})=>{
    const food_data = GetByCategories(categories)

    const getSelectedFoods = useCallback(()=>{
        if(selectedCat && selectedCat.length > 0)
            return food_data.data.filter((fd)=>selectedCat.indexOf(fd.category) !== -1 )
        return food_data.data
    },[selectedCat,food_data.data])
    console.log(food_data)

    if( food_data.error)
        return <Error msg={"Error while retrieving Menu information"} error={food_data.error} />
    if( food_data.loading)
        return <Loading />
    return <motion.div className="menu-items" variants={staggerChildren()} animate="animate" initial="initial" exit="exit">
        {food_data.data && food_data.data.length > 0 &&  getSelectedFoods().map((item,key)=><MenuItem key={key} food={item} />)}
    </motion.div>
}

const MenuItem =({food})=>{
    const usenav = useNavigate()
    return <motion.div variants={TranslateIn()} className="menu-item" onClick={(e)=>usenav(ROUTES.FOOD.GET_REVIEW(food.id))}>
            <img src={food.img} alt={food.title}/>
            <p>{food.title}</p>
    </motion.div>
}
export default AllFood