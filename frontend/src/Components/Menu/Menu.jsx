import { useState } from "react"
import MenuItems from "./MenuItems"
import MenuNav from "./MenuNav"
export const Menu = ()=>{
    const [selectedCats,setSelectedCats] = useState([])

    return <div className="menu">
        <MenuNav setSelectedCats={setSelectedCats} selectedCats={selectedCats}/>
        <MenuItems categories ={selectedCats} />
    </div>
}

export default Menu