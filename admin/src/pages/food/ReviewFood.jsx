import { useNavigate, useParams } from "react-router-dom"
import {GetFoodById,DeleteFoodById} from "../../lib/FoodDal"
import Loading from "../../components/Loading"
import Error from "../../components/Error"
import * as ROUTES from "../../ROUTES"
import { useContext } from "react"
import { UserContext } from "../../contexts"
import {motion} from "framer-motion"
import { FadeIn } from "../../animations"

const ReviewFood =()=>{
    const {foodid} = useParams()
    const {result : food,loading,error} = GetFoodById(foodid)
    const {deleteFood} = DeleteFoodById()
    const user = useContext(UserContext)
    const usenav = useNavigate()
    if( error)
        return <Error msg={"Error while retrieving Food information " + foodid} error={error} />
    if( loading)
        return <Loading />
    return  <>
    <h1 className="data-review-id">#{foodid}</h1>
    <motion.div variants={FadeIn()} className="data-review">
        <div className="data-review-header">
            <h1>{food.title} : {food.price}$</h1>
            <div>
                {user.profile.permissions.food.manage && <><button onClick={(e)=>{
                    usenav(ROUTES.FOOD.GET_UPDATE(food.id))
                }}>Update</button>
                <button onClick={(e)=>{
                    try{
                        deleteFood(food.id)
                        usenav(ROUTES.FOOD.ALL)
                    }catch(err){
                        console.log(err)
                    }
                }}>Delete</button></>}
            </div>
        </div>
        <div className="data-review-body">
            <img src={food.img} alt="" />
            <h2>Description: </h2>
            <p>{food.description}</p>
            <h2>Category: {food.category}</h2>
            <h2>Price: {food.price}$</h2>
            <div>
                {food.options && food.options.length > 0 && <h2>Options:</h2>}
                {food.options && food.options.map((opt,key)=><Option key={key} opt={opt} />)}
            </div>
        </div>
    </motion.div >
    </>
}
const Option = ({opt})=>{
    if(opt.type === 'check'){
        return <p className="option-item"> <img className="make-img-blue" src="/checkbox.png" alt="" />{opt.msg} : {opt.price}$</p>
    }else{
       return <>   
        <p className="option-item"> <img className="make-img-blue" src="/radio-button.png" alt="" />{opt.msg} </p>
        <div className="select-options">
            {opt.choices && opt.choices.map((choice,key)=><p className="option-item" key={100+key}> <img className="make-img-blue" src="/radio.png" alt="" />{choice.msg} : {choice.price}$</p>)}
        </div>
        </>
    }
}
export default ReviewFood