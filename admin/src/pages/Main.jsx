import { Routes,Route, Navigate } from "react-router-dom"
import Nav from "../components/Nav"
import * as ROUTES from "../ROUTES"
import ORDERS from "./orders"
import FOOD from "./food"
import { useContext } from "react"
import { UserContext } from "../contexts"

const Main = ()=>{
    const user = useContext(UserContext)
    if(!user)
        return <Navigate to={ROUTES.AUTH.SINGIN} />
    if(user && !user.emailVerified)
        return <Navigate to={ROUTES.AUTH.VALIDATE_EMAIL} />
    return <div className="main-content">
        <Nav />
        <div className="main">
            <Routes>

                <Route path={ROUTES.ORDERS.ALL} element={<ORDERS.AllOrders />} />
                <Route path={ROUTES.ORDERS.ACCOMPLISHED} element={<ORDERS.Accomplished />} />
                <Route path={ROUTES.ORDERS.CANCELED} element={<ORDERS.Canceled />} />
                <Route path={ROUTES.ORDERS.WAITING} element={<ORDERS.Waiting />} />
                <Route path={ROUTES.ORDERS.PENDING} element={<ORDERS.Pending />} />
                <Route path={ROUTES.ORDERS.REVIEW} element={<ORDERS.Review />} />

                <Route path={ROUTES.FOOD.ADD} element={<FOOD.Add />} />
                <Route path={ROUTES.FOOD.ALL} element={<FOOD.All />} />
                <Route path={ROUTES.FOOD.REVIEW} element={<FOOD.Review />} />
                <Route path={ROUTES.FOOD.UPDATE} element={<FOOD.Update />} />
                <Route path={ROUTES.FOOD.CATEGORIES} element={<FOOD.Categories />} />

            </Routes>
        </div>
    </div>
}
export default Main