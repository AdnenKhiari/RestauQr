import { useContext } from "react"
import { Navigate, useParams } from "react-router-dom"
import Error from "../../components/Error"
import Loading from "../../components/Loading"
import { UserContext } from "../../contexts"
import {GetProfile} from "../../lib/Auth"
import * as ROUTES from "../../ROUTES"
import ProfileSettings from "./ProfileSettings"
const Profile = ()=>{

    const user = useContext(UserContext)

    const {userid} = useParams()
    const {result: profile,error,loading} = GetProfile(userid)
    console.log(profile,error,loading)
    if(error)
        return <Error  error={error} msg="Could Not Retrieve User Profile" />
    if(loading)
        return <Loading />
    
    if(userid === user.uid)
        return  <ProfileSettings me={true} profile={user.profile} />
    if(!user.profile.permissions.users.read)
        return <Navigate to={ROUTES.ORDERS.ALL} />  
    return  <ProfileSettings me={false} profile={profile} />

}
export default Profile