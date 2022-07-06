import {BrowserRouter,Route,Routes} from "react-router-dom"
import Home from "./Page/Home";
import "./Style/main.scss"
import { CartContext } from "./Components/Contexts";
import { useState } from "react";
function App() {
  const [cart,setCart] = useState([])
  return (
    <BrowserRouter >
    <CartContext.Provider value={[cart,setCart]}>
    <Routes>
      <Route path='/*' index element={<Home />} />
    </Routes>
    </CartContext.Provider>
    </BrowserRouter>
  );
}

export default App;