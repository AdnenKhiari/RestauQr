import {BrowserRouter,Route,Routes} from "react-router-dom"
import Home from "./Page/Home";
import "./Style/main.scss"

import {initializeApp} from "firebase/app"
import {getFirestore} from "firebase/firestore"
import {firebaseConfig} from "./dev.conf"
import {getMessaging} from "firebase/messaging"
import {GetToken,GetPushMessages} from  "./Lib/PushNotifications"
import { useState } from "react";
import { NotificationsContext } from "./Components/Contexts";
function App() {
  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)
  const msg = getMessaging(app)

  const [notifications,setNotifications] = useState([])



  //console.log = ()=>{}
  return (
    <NotificationsContext.Provider value={[notifications,setNotifications]}>

    <BrowserRouter >
    <Routes>
      <Route index path='/:tableid/*' element ={<Home />}   />
      <Route path="*" element={<h1>Not Found</h1> }/>
    </Routes>
    </BrowserRouter>
    </NotificationsContext.Provider>

  );
}

export default App;