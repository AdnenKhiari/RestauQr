import { Link, useNavigate, useParams } from "react-router-dom"
import {GetSubOrderById, UpdateSubOrder} from "../../lib/OrderDal"
import Loading from "../../components/Loading"
import Error from "../../components/Error"
import { useState } from "react"
import { useEffect } from "react"
import { useContext } from "react"
import { UserContext } from "../../contexts"
import { FadeIn } from "../../animations"
import {motion} from "framer-motion"
import * as ROUTES from "../../ROUTES"
import {formatFbDate, getOptionsList} from "../../lib/utils"
import { useRef } from "react"
const SubReviewOrder = ()=>
{
    const {orderid,subid} = useParams()
    const {result,error,loading} = GetSubOrderById(orderid,subid)
    const user = useContext(UserContext)

    console.log(result,error,loading)
    if(loading)
        return <Loading />
    if(error)
        return <Error error={error} msg={"Error ,Check the Id Or report the issue"} />
    return <SubReviewOrderUi orderid={orderid} order={result} />
}

export const SubReviewOrderUi = ({orderid,order})=>{
    const user = useContext(UserContext)
    const states = ['waiting','pending','accomplished','canceled']
    const [stateidx,setStateidx] = useState(0)
    const reasonref = useRef()
    const {mutate : orderUpdate,error : errorUpdate} = UpdateSubOrder(orderid,order.id)
    useEffect(()=>{
        if(order)
            setStateidx(states.findIndex(t => t === order.status.toLowerCase()))
    },[order])

    const getImg = (status)=>{
        if(status === 'accomplished')
            return "/checked.png"
        else if(status === 'canceled'){
            return "/cancel.png"
        }else if(status === 'waiting'){
            return "/time-left.png"
        }else{
            return "/schedule.png"
        }
    }
    const usenav = useNavigate()
    const changeStatus = ()=>{
        if(states[stateidx] ==="canceled"){
            setStateidx(states.findIndex(t => t === order.status.toLowerCase()))
        }else if(states[stateidx] === order.status){
            setStateidx(Math.min(3,(stateidx + 1)))
        }else{
            setStateidx(3)
        }
    }

    return <motion.div variants={FadeIn()} className="order-review">
       <h1>#{formatFbDate(order.time)} <div>
        <button onClick={(e)=>usenav(ROUTES.ORDERS.GET_REVIEW(orderid))}>Order</button>
         {user.profile.permissions.orders.manage &&  <button onClick={async (e)=> {
            try{
                await orderUpdate(states[stateidx],order,reasonref.current && reasonref.current.value);
                usenav(0)
            }
            catch(err){
                console.log(err)
            }
         }}>Save</button>}
        </div> </h1>
       <div className="order-meta">
            <div><img src="/table-ronde.png" alt="" /><h2>#{order.tableid}</h2></div> 
            <div><img src="/remise.png" alt="" /><h2>{order && order.price}$</h2></div>
            <div onClick={(e)=> user.profile.permissions.orders.manage && changeStatus() } className={states[stateidx].toLowerCase()}><img src={getImg(states[stateidx].toLowerCase())}
            alt="" /><h2>{states[stateidx].toLowerCase()}</h2></div>
       </div>
       {states[stateidx] === 'canceled' && <div className="cancel-reason">
        <label htmlFor="reason">Reason</label>
            <textarea ref={reasonref} defaultValue={order.reason} name="reason" id="reason" cols="30" rows="10"></textarea>
       </div>}
       <div className="order-foods">
                {order && order.food.map((fd,key)=>  <div key={key} className="order-food">
            <img onClick={(e)=>usenav(ROUTES.FOOD.GET_REVIEW(fd.id))} src={fd.img} alt={fd.title} />
            <div className="food-details">
                <h2>{fd.title} x {fd.count} ({fd.price}$)</h2>
                <div className="food-options">
                {getOptionsList(fd).map((opt)=><p>{opt}</p>)}
                </div>
            </div>
        </div>)}
       </div>

    </motion.div>
}
export default SubReviewOrder