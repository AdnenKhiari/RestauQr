import { useParams } from "react-router-dom"
import FoodInfo from "../../components/FoodInfo"
import { GetFoodById } from "../../lib/FoodDal"
import Loading from "../../components/Loading"
import Error from "../../components/Error"

const UpdateFood = ()=>{
    const {foodid} = useParams()
    const {result,error,loading} = GetFoodById(foodid,true)
    console.log(result,error,loading)
    if(loading)
        return <Loading  />
    if(error)
        return <Error err={error} msg='Invalid ID' />
    return <FoodInfo defaultVals={result} />
}
export default UpdateFood
