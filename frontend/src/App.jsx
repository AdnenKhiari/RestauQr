import {BrowserRouter,Route,Routes} from "react-router-dom"
import Home from "./Page/Home";
import "./Style/main.scss"

import {initializeApp} from "firebase/app"
import {getFirestore} from "firebase/firestore"

import {firebaseConfig} from "./dev.conf"

function App() {
  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)
  return (
    <BrowserRouter >
      <Home />
    </BrowserRouter>
  );
}

export default App;