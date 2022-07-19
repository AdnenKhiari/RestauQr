import { GetAllProfiles } from "../../lib/Auth"
import Error from "../../components/Error"
import Loading from "../../components/Loading"
import * as ROUTES from "../../ROUTES"
import {Navigate, useNavigate} from "react-router-dom"
import { useContext } from "react"
import { UserContext } from "../../contexts"
import { FadeIn } from "../../animations"
import {motion} from "framer-motion"

const AllProfiles = ()=>{

    const user = useContext(UserContext)
    const {result,error,loading} = GetAllProfiles()
    const usenav = useNavigate()
    console.log(result,error,loading)

    if(error)
        return <Error  error={error} msg="Could Not Retrieve User Profile" />
    if(loading)
        return <Loading />
    if(!user.profile.permissions.users.read)
        return <Navigate to={ROUTES.ORDERS.ALL} />    
    return <motion.div variants={FadeIn()} className="profiles">
        <h1>Users : </h1>
        <div className="users">
        {result && result.map((item,key)=><div onClick={(e)=>usenav(ROUTES.USERS.GET_PROFILE(item.id))} key={key}>{item.name}</div>)}
        </div>
    </motion.div >
}
export default AllProfiles