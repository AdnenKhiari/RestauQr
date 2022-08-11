import {Link, useNavigate} from "react-router-dom"
import * as ROUTES from "../ROUTES"
import {LogOut} from "../lib/Auth"
import { useContext } from "react"
import { UserContext } from "../contexts"
const Nav = ()=>{
    const {error: logouterr,loading: loadingerr,logout} = LogOut()
    const user = useContext(UserContext)
    const usenav = useNavigate()
    return <div className="nav-bar">
        <h1 onClick={(e)=>usenav('/')}>Menu</h1>
        <nav className="main-nav">
            <ul>
                <li>
                    <img src="/shopping-bag.png" alt="orders" />
                    <h2>Orders</h2>
                </li>
                <Link to={ROUTES.ORDERS.ALL}><li>All Orders</li></Link>
                <Link to={ROUTES.ORDERS.WAITING}><li>Waiting Orders</li></Link>
                <Link to={ROUTES.ORDERS.PENDING}><li>Pending Orders</li></Link>
                <Link to={ROUTES.ORDERS.ACCOMPLISHED}><li>Accomplished Orders</li></Link>
                <Link to={ROUTES.ORDERS.CANCELED}><li>Canceled Orders</li></Link>
                <li>
                    <img src="/restaurant.png" alt="food" />
                    <h2>Food</h2>
                </li>
                <Link to={ROUTES.FOOD.ALL} ><li>All Food</li></Link>
                {user.profile.permissions.food.manage && <Link to={ROUTES.FOOD.ADD}><li>New Food</li></Link>}
                <li>
                    <img src="/options.png" alt="options" />
                    <h2>Categories</h2>
                </li>
                <Link to={ROUTES.OPTIONS.MENU} ><li>Categories</li></Link>
                <li>    
                    <img src="/table-a-dinner.png" alt="Tables" />
                    <h2>Tables</h2>
                </li>
                <Link to={ROUTES.TABLES.ALL} ><li>All Tables</li></Link>
                <Link to={ROUTES.TABLES.ADD} ><li>New Table</li></Link>
                <li>
                    <img src="/inventaire.png" alt="inventory" />
                    <h2>Inventory</h2>
                </li>
                <Link to={ROUTES.INVENTORY.ALL} ><li>All Products</li></Link>
                <Link to={ROUTES.INVENTORY.ADD_PRODUCT} ><li>New Product</li></Link>
                <Link to={ROUTES.INVENTORY.ALL_ORDERS} ><li>All Product Orders</li></Link>

                <li>
                    <img src="/utilisateur.png" alt="users" />
                    <h2>Users</h2>
                </li>
                {user.profile.permissions.users.read &&  <Link to={ROUTES.USERS.ALL} ><li>All Users</li></Link>}
                <Link to={ROUTES.USERS.MY_PROFILE}><li>Profile</li></Link>
            </ul>
        </nav>
        <button className="nav-button" onClick={async (e)=>{
            try{
                await logout()
                usenav(0)
            }catch(err){
                console.log(err)
            }
        }}>Log Out !</button>
    </div>
}
export default Nav