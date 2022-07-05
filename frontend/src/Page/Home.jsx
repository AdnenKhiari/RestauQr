import Menu from "../Components/Menu/Menu"
const Home = ()=>{
    return <>
        <div className="hero">
            <h1>Restaurant Kdhe</h1>
            <p>Your place of choice</p>
        </div>
        <div className="menu-container">
            <Menu />
        </div>
    </>
}

export default Home