import { useContext } from "react"
import { useParams } from "react-router-dom"
import Error from "../../components/Error"
import Loading from "../../components/Loading"
import { UserContext } from "../../contexts"
import {GetProfile} from "../../lib/Auth"
import ProfileSettings from "./ProfileSettings"
const Profile = ()=>{
    const user = useContext(UserContext)
    console.log("Found EZZ",user)
    return <ProfileSettings accountid={user.id} me={true} profile={user.profile} />
}
export default Profile