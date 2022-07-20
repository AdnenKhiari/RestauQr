import React from "react"

const categories =['Pizza','Pasta','Gratin','Plat','Sandiwch Chaud','Sandwich Froid','Dessert']

const MenuNav = ({cats,selectedCats,setSelectedCats})=>{

    const SelectCategory = (cat)=>{
        const exists = selectedCats.indexOf(cat)
        if(exists !== -1){
            selectedCats.splice(exists,1)
        }else{
            selectedCats.push(cat)
        }
        setSelectedCats([...selectedCats])
    }

    return <div className="menunav-container">
        {cats.map( (cat,index) => <div key={index} onClick={(e)=>SelectCategory(cat)} className={"menunav-item" + (selectedCats.indexOf(cat)!== -1 ? ' selected' : '') }>
            <p>{cat}</p>
        </div>)}
    </div>
}
export default MenuNav