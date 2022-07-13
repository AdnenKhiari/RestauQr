
import "./style/main.scss"
import {Routes,Route} from "react-router-dom"
import Test from "./test"
import Main from "./pages/Main"
import {firebaseConfig} from "./dev.conf"
import {initializeApp} from "firebase/app"
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"

function App() {
  const app = initializeApp(firebaseConfig)
  const storage = getStorage(app)
  const db = getFirestore(app)
  return (
    <Routes>
     <Route path="/test" element={<Test />} />
     <Route path="/*" element={<Main />}  />
    </Routes>

  );
}

export default App;
