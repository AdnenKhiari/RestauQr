import { Routes,Route } from "react-router-dom"
import Nav from "../components/Nav"
import * as ROUTES from "../ROUTES"
const Main = ()=>{
    return <div className="main-content">
        <Nav />
        <div className="main">
            <Routes>
                <Route index path={ROUTES.ORDERS.ALL} />
            </Routes>
        </div>
    </div>
}
export default Main