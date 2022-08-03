import { useContext } from "react"
import Popup from "reactjs-popup"
import { GetToken } from "../Lib/PushNotifications"
import { NotificationsContext } from "./Contexts"

const NotificationsContainer = ()=>{
    const [notifications,setNotifications] = useContext(NotificationsContext)

    GetToken()
    console.log("NOT",notifications)
    return  <Popup  defaultOpen={notifications.length > 0}
    open={notifications.length > 0}
        closeOnDocumentClick={false}
        position="center center">
        <div className="absolute-popup">
            <div className="notification-container">
            {notifications.map((not,index)=>{
            return <NotifUi key={index}  index={index} data={not} />
             })}
            </div>
        {close => notifications.length === 0 && close()}
        </div>
    </Popup>
    
}
const NotifUi = ({data,index})=>{
    const [notifications,setNotifications] = useContext(NotificationsContext)
    return <div className="notification-item"> 
        <div>
        <h2>{data.title}</h2>

        <p>{data.body}</p>
        </div>

        <img src="/radio.png" onClick={(e)=>{
            notifications.splice(index,1)
            setNotifications([...notifications])
        }} alt="closed" />
    </div>
}
export default NotificationsContainer
