import { Routes,Route } from "react-router-dom"
import Nav from "../components/Nav"
import * as ROUTES from "../ROUTES"
import ORDERS from "./orders"
const Main = ()=>{
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
            </Routes>
        </div>
    </div>
}
export default Main