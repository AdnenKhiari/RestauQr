
import "./style/main.scss"
import {Routes,Route} from "react-router-dom"
import Test from "./test"
import Main from "./pages/Main"
import SignIn from "./pages/auth/SignIn"
import SignUp from "./pages/auth/SignUp"

import {firebaseConfig} from "./dev.conf"
import {initializeApp} from "firebase/app"
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"
import {getAuth} from "firebase/auth"

function App() {
  const app = initializeApp(firebaseConfig)
  const storage = getStorage(app)
  const db = getFirestore(app)
  const auth = getAuth(app)

  return (
    <Routes>
     <Route path="/test" element={<Test />} />
     <Route path="/signin" element={<SignIn />} />
     <Route path="/signup" element={<SignUp />} />
     <Route path="/*" element={<Main />}  />
    </Routes>

  );
}

export default App;
