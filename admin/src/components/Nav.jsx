import {Link, useNavigate} from "react-router-dom"
import * as ROUTES from "../ROUTES"
import {LogOut} from "../lib/Auth"
import { useContext } from "react"
import { UserContext } from "../contexts"
import { getLevel } from "../lib/utils"

import shoppingbagimg from "../images/shopping-bag.png"
import utilisateurimg from "../images/utilisateur.png"
import restaurantimg from "../images/restaurant.png"
import optionsimg from "../images/options.png"
import tableadinnerimg from "../images/table-a-dinner.png"
import inventaireimg from "../images/inventaire.png"


const Nav = ()=>{
    const {error: logouterr,loading: loadingerr,logout} = LogOut()
    const user = useContext(UserContext)
    const usenav = useNavigate()
    return <div className="nav-bar">
        <h1 onClick={(e)=>usenav('/')}>Menu</h1>
        <nav className="main-nav">
            <ul>
                <li>
                    <img src={shoppingbagimg} alt="orders" />
                    <h2>Orders</h2>
                </li>
                <Link to={ROUTES.ORDERS.ALL}><li>All Orders</li></Link>
                <Link to={ROUTES.ORDERS.WAITING}><li>Waiting Orders</li></Link>
                <Link to={ROUTES.ORDERS.PENDING}><li>Pending Orders</li></Link>
                <Link to={ROUTES.ORDERS.ACCOMPLISHED}><li>Accomplished Orders</li></Link>
                <Link to={ROUTES.ORDERS.CANCELED}><li>Canceled Orders</li></Link>
                <li>
                    <img src={restaurantimg} alt="food" />
                    <h2>Food</h2>
                </li>
                <Link to={ROUTES.FOOD.ALL} ><li>All Food</li></Link>
                {getLevel(user.profile.permissions.food) >= getLevel("manage") && <Link to={ROUTES.FOOD.ADD}><li>New Food</li></Link>}
                <li>
                    <img src={optionsimg} alt="options" />
                    <h2>Categories</h2>
                </li>
                <Link to={ROUTES.OPTIONS.CATEGORIES} ><li>Categories</li></Link>
                <Link to={ROUTES.OPTIONS.UNITS} ><li>Units</li></Link>

                <li>    
                    <img src={tableadinnerimg} alt="Tables" />
                    <h2>Tables</h2>
                </li>
                <Link to={ROUTES.TABLES.ALL} ><li>All Tables</li></Link>
                {getLevel(user.profile.permissions.tables) >= getLevel("manage") &&  <Link to={ROUTES.TABLES.ADD} ><li>New Table</li></Link>}
                <li>
                    <img src={inventaireimg} alt="inventory" />
                    <h2>Inventory</h2>
                </li>
                <Link to={ROUTES.INVENTORY.ALL} ><li>All Products</li></Link>
                <Link to={ROUTES.INVENTORY.ADD_PRODUCT} ><li>New Product</li></Link>
                <Link to={ROUTES.INVENTORY.ALL_ORDERS} ><li>All Product Orders</li></Link>

                <li>
                    <img src={utilisateurimg} alt="users" />
                    <h2>Users</h2>
                </li>
                {getLevel(user.profile.permissions.users) >= getLevel("read") &&  <Link to={ROUTES.USERS.ALL} ><li>All Users</li></Link>}
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