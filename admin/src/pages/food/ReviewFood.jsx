import { useNavigate, useParams } from "react-router-dom"
import {GetFoodById,DeleteFoodById} from "../../lib/FoodDal"
import Loading from "../../components/Loading"
import Error from "../../components/Error"
import * as ROUTES from "../../ROUTES"
import { useContext, useEffect, useMemo, useState } from "react"
import { UserContext } from "../../contexts"
import {motion} from "framer-motion"
import { FadeIn } from "../../animations"
import {useTable,useSortBy} from "react-table"
import { getLevel } from "../../lib/utils"

import uploadimg from "../../images/upload.png"
import checkboximg from "../../images/checkbox.png"
import radiobuttonimg from "../../images/radio-button.png"
import radioimg from "../../images/radio.png"

const ReviewFood =()=>{
    const {foodid} = useParams()
    const {result : food,loading,error} = GetFoodById(foodid)
    const {deleteFood} = DeleteFoodById(foodid)
    const user = useContext(UserContext)
    const usenav = useNavigate()
    if( error)
        return <Error msg={"Error while retrieving Food information " + foodid} error={error} />
    if( loading)
        return <Loading />
    return  <>
    {/*<h1 className="data-review-id">#{foodid}</h1>*/}
    <motion.div variants={FadeIn()} className="data-review">
        <div className="data-review-header">
            <h1><span>{food.title}</span> : {food.price}$</h1>
            <div>
                {getLevel(user.profile.permissions.food)>=  getLevel("manage") && <><button onClick={(e)=>{
                    usenav(ROUTES.FOOD.GET_UPDATE(food.id))
                }}>Update</button>
                <button onClick={async (e)=>{
                    try{
                        await deleteFood(food.id)
                        usenav(ROUTES.FOOD.ALL)
                    }catch(err){
                        console.log(err)
                    }
                }}>Delete</button></>}
            </div>
        </div>
        <div className="data-review-body">
            <img src={food.img} alt="" />
            <h2><span>Description:</span>  </h2>
            <h2>{food.description}</h2>
            <h2><span>Category:</span> {food.category}</h2>
            <h2><span>Base Price:</span> {food.price}$</h2>
            <h2><span>Ingredients:</span></h2>
            <Ingredients foodopt={food} />

            <div>
                <GetOptions init={food.ingredients} />
            </div>
        </div>
    </motion.div >
    </>
}
const GetOptions = ({init})=>{
    const [list,setList ] = useState([])
    const getDetails = (opts,res,padding = 0)=>{
        if(!opts || !opts.options)
            return
        opts.options.forEach((item)=>{
            if(item.type === 'check'){
                res.push({padding:padding,msg: item.msg,type: item.type,price: item.price})
                getDetails(item.ingredients,res,padding+30)
            }
            if(item.type === 'select'){
                const ad = {padding:padding,msg: item.msg,type: item.type,price: item.price,choices: true}
                res.push(ad)
                item.choices.forEach(choice => {
                    res.push({msg: choice.msg,price: choice.price,padding: padding+20   })
                    getDetails(choice.ingredients,res,padding+50)
                });
            }
        })
    }
    useEffect(() => {
        const res = []
        getDetails(init,res)
        setList([...res])
        console.log(list)
    }, [init])

    return <div>
        {list.map((opt,index)=><Option key={index} opt={opt} />)}
    </div>

}
const Ingredients = ({foodopt})=>{
    const [list,setList ] = useState([])

    const getDetails = (ing,name = "",res)=>{
        if(!ing || !ing.ingredients)
            return
        if(ing.ingredients.products && ing.ingredients.products.length > 0){
            res.push({
                name: name.join('/'),
                price: ing.price,
                values: ing.ingredients.products.map((product)=>{
                    product.price = (product.quantity * 1.0 * product.sellingUnitPrice / product.unitQuantity) +"$"
                    return product
                })
            })
        }
        ing.ingredients.options && ing.ingredients.options.length > 0 && ing.ingredients.options.forEach((option)=>{
            if(option.type === 'check')
                getDetails(option,[...name,option.msg],res)
            if(option.type === "select"){
                option.choices.forEach((choice)=>{
                    getDetails(choice,[...name,`${option.msg}:${choice.msg}`],res)
                })
            }
        })
    }
    useEffect(() => {
        const res = []
        getDetails(foodopt,["Base"],res)
        setList([...res])

        console.log(list)
    }, [foodopt])
    
    return <div className="all-ingredients-tables">
        {list.map((item,index)=>< IngredientsTable price={item.price} key={index} products={item.values} path={item.name} />)}
    </div>
}
const IngredientsTable = ({products,path,price})=>{

    const columns = useMemo(()=>{
        return [{
            Header: 'Name',
            accessor: 'name'
        },
        {
            Header: 'Quantity/U',
            accessor: 'unitQuantity',
            Cell: ({value,row})=> value+""+row.original.unit.name
        },
        {
            Header: 'Price/U',
            accessor: 'sellingUnitPrice',
            Cell: ({value})=>value +"$"
        },
        {
            Header: 'Quantity',
            accessor: 'quantity'
        },{
            Header: 'Price',
            accessor: 'price'
        }]
    },[])

    const usenav = useNavigate()
    const tb = useTable({columns: columns,data: products},useSortBy)

    return <div className="products-table">
        <h2><span>{path}</span></h2>
        <table {...tb.getTableProps()}>
            <thead>
                {tb.headerGroups.map((HeaderGroup)=><tr  {...HeaderGroup.getHeaderGroupProps()}>
                    {HeaderGroup.headers.map((col)=><th  {...col.getHeaderProps(col.getSortByToggleProps())}>
                        <div className="header-tag">
                            {col.render("Header")}
                            {col.isSortedDesc !== undefined && (col.isSortedDesc ? <img style={{transform: "rotate(180deg)"}} src={uploadimg} alt="uparrow" /> : <img  src={uploadimg} alt="uparrow" />) }
                        </div>
                    </th>)}
                </tr>)}
            </thead>
            <tbody {...tb.getTableBodyProps()}>
                {tb.rows.map((row)=>{
                    tb.prepareRow(row)
                    return <tr className="review-row" onClick={(e)=>usenav(ROUTES.INVENTORY.GET_REVIEW_PRODUCT(row.original.id))} {...row.getRowProps()}>
                        {row.cells.map((cell)=><td {...cell.getCellProps()}>{cell.render("Cell")}</td>)}
                    </tr>
                })}
                <tr><td></td><td></td><td></td><td></td><td>
                  <h3><span>Selling Price : {price}</span></h3>  
                </td></tr>
            </tbody>
        </table>
    </div>
}
const Option = ({opt})=>{
    if(opt.type === 'check'){
        return <p style={{paddingLeft: opt.padding}} className="option-item"> <img className="make-img-blue" src={checkboximg} alt="" />{opt.msg} : {opt.price}$</p>
    }else{
       return <>   
        {opt.choices && <p style={{paddingLeft: opt.padding}} className="option-item"><img className="make-img-blue" src={radiobuttonimg} alt="" />{opt.msg} </p>}
        {!opt.choices && <p style={{paddingLeft: opt.padding}} className="option-item" > <img className="make-img-blue" src={radioimg} alt="" />{opt.msg} : {opt.price}$</p>}
        </>
    }
}
export default ReviewFood