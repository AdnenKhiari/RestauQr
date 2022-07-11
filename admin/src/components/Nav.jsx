import {Link} from "react-router-dom"
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
                <Link to="/"><li>All Orders</li></Link>
                <Link to="/"><li>Waiting Orders</li></Link>
                <Link to="/"><li>Pending Orders</li></Link>
                <Link to="/"><li>Accomplished Orders</li></Link>
                <Link to="/"><li>Canceled Orders</li></Link>
                <Link to="/"><li>Review Orders</li></Link>
                {/* Kind of a grid that shows the state and on click gives you the current order of that table */}
                <Link to="/"><li>Get Table Orders</li></Link>
                <li>
                    <img src="/restaurant.png" alt="food" />
                    <h2>Food</h2>
                </li>
                {/* Grid With food pictures and menu ( like in the main app ) on click gives you the corresponding correct page  */}
                <Link to="/"><li>Review Food</li></Link>
                <Link to="/"><li>Add Food</li></Link>
                <Link to="/"><li>Update Food</li></Link>
                <li>
                    <img src="/utilisateur.png" alt="food" />
                    <h2>Users</h2>
                </li>
                {/* Simple Users Account List , on click tbadil el username wil pass wil roles li andou (admin , cuisinier ) */}
                <Link to="/"><li>Review Food</li></Link>
                <Link to="/"><li>Add Food</li></Link>
                <Link to="/"><li>Update Food</li></Link>
            </ul>
        </nav>
    </div>

}
export default Nav