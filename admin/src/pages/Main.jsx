import { Routes,Route, Navigate } from "react-router-dom"
import Nav from "../components/Nav"
import * as ROUTES from "../ROUTES"
import ORDERS from "./orders"
import FOOD from "./food"
import USERS from "./users"

import { useContext } from "react"
import { UserContext } from "../contexts"
import OPTIONS from "./options"

const Main = ()=>{
    const user = useContext(UserContext)
    if(!user)
        return <Navigate to={ROUTES.AUTH.SINGIN} />
    if(user && !user.emailVerified)
        return <Navigate to={ROUTES.AUTH.VALIDATE_EMAIL} />
    if(user && !user.profile)
        return <Navigate to={ROUTES.AUTH.INIT_PROFILE} />
    return <div className="main-content">
        <Nav />
        <div className="main">
            <h1 className="logged-user">You Are Logged As : {user.profile.name}</h1>
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
                <Route path={ROUTES.OPTIONS.MENU} element={<OPTIONS />} />

                <Route path={ROUTES.USERS.MY_PROFILE} element={<USERS.MyProfile />} />
                <Route path={ROUTES.USERS.PROFILE} element={<USERS.Profile />} />
                <Route path={ROUTES.USERS.ALL} element={<USERS.AllProfiles />} />

            </Routes>
        </div>
    </div>
}
export default Main