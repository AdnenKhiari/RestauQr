import { useParams } from "react-router-dom"
import {GetOrderById, UpdateOrder} from "../../lib/OrderDal"
import Loading from "../../components/Loading"
import Error from "../../components/Error"
import { useState } from "react"
import { useEffect } from "react"

const ReviewOrder = ()=>
{
    const {orderid} = useParams()
    const [stateidx,setStateidx] = useState(0)
    const {result : order,error,loading} = GetOrderById(orderid)
    const {mutate : orderUpdate,error : errorUpdate} = UpdateOrder(orderid)

    console.log(order,error,loading)
    const states = ['waiting','pending','accomplished','canceled']

    useEffect(()=>{
        if(!error && !loading && order)
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

    const changeStatus = ()=>{
        setStateidx((stateidx + 1)%4)
    }

    if(loading)
        return <Loading />
    if(error)
        return <Error error={error} msg={"Error ,Check the Id Or report the issue"} />
    return <div className="order-review">
        <h1>#{orderid} <button onClick={(e)=>orderUpdate(states[stateidx])}>Save</button></h1>

       <div className="order-meta">
            <div><img src="/table-ronde.png" alt="" /><h2>#{order.tableid}</h2></div> 
            <div><img src="/remise.png" alt="" /><h2>{order && order.food.reduce((prev,fd)=>prev+fd.price*fd.count,0)}$</h2></div>
            <div onClick={(e)=>changeStatus()} className={states[stateidx].toLowerCase()}><img src={getImg(states[stateidx].toLowerCase())}
            alt="" /><h2>{states[stateidx].toLowerCase()}</h2></div>
       </div>
       <div className="order-foods">
                {order && order.food.map((fd,key)=>  <div key={key} className="order-food">
            <img src={fd.img} alt={fd.title} />
            <div className="food-details">
                <h2>{fd.title} x {fd.count} ({fd.price}$)</h2>
                <div className="food-options">
                {Object.keys(fd.options).length > 0 && Object.keys(fd.options).filter(f => fd.options[f] !== false).map((opt)=><p>{opt} {typeof(fd.options[opt]) === 'string' && fd.options[opt] }</p>)}
                </div>
            </div>
        </div>)}
       </div>

    </div>
}
export default ReviewOrder