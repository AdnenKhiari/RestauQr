import { Routes,Route } from "react-router-dom"
import Nav from "../components/Nav"
import * as ROUTES from "../ROUTES"
import AllOrders from "./orders/AllOrders"
const Main = ()=>{
    return <div className="main-content">
        <Nav />
        <div className="main">
            <Routes>
                <Route path={ROUTES.ORDERS.ALL} element={<AllOrders />} />
            </Routes>
        </div>
    </div>
}
export default Main