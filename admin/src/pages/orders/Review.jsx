import { useNavigate, useParams } from "react-router-dom"
import {GetOrderById, UpdateOrder} from "../../lib/OrderDal"
import Loading from "../../components/Loading"
import Error from "../../components/Error"
import { useState } from "react"
import { useEffect } from "react"
import { useContext } from "react"
import { UserContext } from "../../contexts"
import { FadeIn } from "../../animations"
import {motion} from "framer-motion"
import * as ROUTES from "../../ROUTES"
import SubOrderTable from "../../components/Tables/SubOrderTable"
import {where} from "firebase/firestore"
import { getLevel } from "../../lib/utils"


import papermoneyimg from "../../images/paper-money.png"
import paidimg from "../../images/paid.png"
import cancelimg from "../../images/cancel.png"
import tablerondeimg from "../../images/table-ronde.png"
import resmiseimg from "../../images/remise.png"

const ReviewOrder = ()=>
{
    const {orderid} = useParams()
    const [stateidx,setStateidx] = useState(0)
    const {result : order,error,loading} = GetOrderById(orderid)
    const {mutate : orderUpdate,error : errorUpdate} = UpdateOrder(orderid)
    const user = useContext(UserContext)
    console.log(order,error,loading)
    const states = ['unpaid','paid','canceled']

    useEffect(()=>{
        if(!error && !loading && order)
            setStateidx(states.findIndex(t => t === order.status.toLowerCase()))
    },[order])

    const getImg = (status)=>{
        if(status === 'unpaid')
            return {papermoneyimg}
        else if(status === 'paid'){
            return {paidimg}
        }else if(status === 'canceled'){
            return {cancelimg}
        }
    }
    const usenav = useNavigate()
    const changeStatus = ()=>{
        if(order.status === 'paid'){
            return
        }
        if(order.status === 'canceled'){
            return
        }
        setStateidx((stateidx+1)%2)
    }

    if(loading)
        return <Loading />
    if(error)
        return <Error error={error} msg={"Error ,Check the Id Or report the issue"} />
    return <motion.div variants={FadeIn()} className="order-review">
        <h1>Order: {getLevel(user.profile.permissions.orders) >= getLevel("manage") &&  <button onClick={async (e)=>{
            await orderUpdate(states[stateidx])
            usenav(0)
        }}>Save</button>}</h1>

       <div className="order-meta">
            <div><img src={tablerondeimg} alt="" /><h2>#{order.tableid}</h2></div> 
            <div><img src={resmiseimg} alt="" /><h2>{order && order.price}$</h2></div>
            <div onClick={(e)=> getLevel(user.profile.permissions.orders)  >= getLevel("manage") && changeStatus() } className={(states[stateidx] && states[stateidx].toLowerCase()) === "unpaid" ? 'waiting' : (states[stateidx] && states[stateidx].toLowerCase()) === 'canceled' ? 'canceled' : 'accomplished'}><img src={getImg(states[stateidx].toLowerCase())}
            alt="" /><h2>{states[stateidx].toLowerCase()}</h2></div>
       </div>
       <SubOrderTable title={"Related Sub Orders"} queryConstraints={{order_ref: orderid}} />
    </motion.div>
}
export default ReviewOrder