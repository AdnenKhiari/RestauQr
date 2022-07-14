import {Link} from "react-router-dom"
import * as ROUTES from "../ROUTES"
const Nav = ()=>{
    return <div className="nav-bar">
        <h1>Menu</h1>
        <nav className="main-nav">
            <ul>
                <li>
                    <img src="/shopping-bag.png" alt="orders" />
                    <h2>Orders</h2>
                </li>
                {/* Universal Table for the orders */}
                <Link to={ROUTES.ORDERS.ALL}><li>All Orders</li></Link>
                <Link to={ROUTES.ORDERS.WAITING}><li>Waiting Orders</li></Link>
                <Link to={ROUTES.ORDERS.PENDING}><li>Pending Orders</li></Link>
                <Link to={ROUTES.ORDERS.ACCOMPLISHED}><li>Accomplished Orders</li></Link>
                <Link to={ROUTES.ORDERS.CANCELED}><li>Canceled Orders</li></Link>
                <li>
                    <img src="/restaurant.png" alt="food" />
                    <h2>Food</h2>
                </li>
                {/* Grid With food pictures and menu ( like in the main app ) on click gives you the corresponding correct page  */}
                <Link to={ROUTES.FOOD.ALL} ><li>All Food</li></Link>
                <Link to={ROUTES.FOOD.ADD}><li>Add Food</li></Link>
                <Link to={ROUTES.FOOD.CATEGORIES} ><li>Categories</li></Link>
                <li>
                    <img src="/utilisateur.png" alt="food" />
                    <h2>Users</h2>
                </li>
                {/* Simple Users Account List , on click tbadil el username wil pass wil roles li andou (admin , cuisinier ) */}
                <Link to={ROUTES.FOOD.REVIEW} ><li>Review Food</li></Link>
                <Link to={ROUTES.FOOD.ADD}><li>Add Food</li></Link>
                <Link to={ROUTES.FOOD.UPDATE}><li>Update Food</li></Link>
            </ul>
        </nav>
    </div>

}
export default Nav