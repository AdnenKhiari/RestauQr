import { useContext, useEffect } from "react"
import Popup from "reactjs-popup"
import { GetToken } from "../Lib/PushNotifications"
import { NotificationsContext, OrderContext } from "./Contexts"

const NotificationsContainer = ()=>{
    const [notifications,setNotifications] = useContext(NotificationsContext)

    GetToken()
    console.log("NOT",notifications)
    return  <Popup  defaultOpen={notifications.length > 0}
    open={notifications.length > 0}
        closeOnDocumentClick={false}
        position="center center"
        >
        <div className="absolute-popup">
            <div className="notification-container">
            {notifications.map((not,index)=>{
            return <NotifUi key={index}  index={index} data={not.data} />
             })}
            </div>
        </div>
    </Popup>
    
}
const NotifUi = ({data,index})=>{
    const [notifications,setNotifications] = useContext(NotificationsContext)
    return <div className="notification-item"> 
        {data.type === "food-status" && <FoodStatusNotif data={data} />}
        <img src="/radio.png" onClick={(e)=>{
            notifications.splice(index,1)
            setNotifications([...notifications])
        }} alt="closed" />
    </div>
}



const FoodStatusNotif = ({data})=>{
    const [order,setOrder] = useContext(OrderContext)
    const ordernum = order.cart.findIndex((ct)=>ct.id === data.subid) + 1
    useEffect(()=>{
        if(ordernum > 0){
            order.cart[ordernum - 1].status = data.status
            setOrder({...order})
        }

    },[])
    return <div>
        <h2>{"Status Update:"}</h2>
        <p>Order Number : {ordernum} Is Now {data.status}</p>
    </div>

}

export default NotificationsContainer
