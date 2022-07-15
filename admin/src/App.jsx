
import "./style/main.scss"
import {Routes,Route, Navigate, useNavigate, useLocation} from "react-router-dom"
import Test from "./test"
import Main from "./pages/Main"
import SignIn from "./pages/auth/SignIn"
import SignUp from "./pages/auth/SignUp"
import ValidateEmail from "./pages/auth/ValidateEmail"

import {firebaseConfig} from "./dev.conf"
import {initializeApp} from "firebase/app"
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"
import {getAuth} from "firebase/auth"
import * as ROUTES from "./ROUTES"
import Error from "./components/Error"
import {UserContext} from "./contexts"
import {GetAuthState} from "./lib/Auth"
import Loading from "./components/Loading"
import ResetPassword from "./pages/auth/ResetPassword"
import ActionCodeResponse from "./pages/auth/ActionCodeResponse"
function App() {
  const app = initializeApp(firebaseConfig)
  const storage = getStorage(app)
  const db = getFirestore(app)
  const auth = getAuth(app)
  const usenav = useNavigate()
  const location = useLocation()
  const {user,loading} = GetAuthState()
  if(loading)
      return <Loading  /> 

  return (
  <UserContext.Provider value={user}>
    <Routes>
     <Route path="/test" element={<Test />} />
     <Route path="/signin" element={<SignIn />} />
     <Route path="/signup" element={<SignUp />} />
     <Route path="/validateemail" element={<ValidateEmail />} />
     <Route path="/resetpassword" element={<ResetPassword />} />
  
     <Route path="/acr/*" element={<ActionCodeResponse />} />

     <Route path="/*" element={<Main />}  />
    </Routes>
    </UserContext.Provider>
  );
}

export default App;
