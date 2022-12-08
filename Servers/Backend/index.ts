import express , {Express} from "express";
import V1 from "./Controller/v1"
import bodyParser from "body-parser"
import { InitFirebase } from "./lib/firebase";
import cookieparser from "cookie-parser"
import ErrHandler from "./ErrHandler"
import cors from "cors"
import LoadEnv from "./utils/Loadenv";
const app = express()

LoadEnv()

app.use(cors({
    origin: (origin,callback)=>{
        return callback(null,true)
    },
    credentials: true
}))

//to parse body from requests
app.use(bodyParser.json({
    verify(req, res, buf, encoding) {
        const reqt : any = req
        reqt.rawBody = buf
    },
}));

//cookie parser for cookies
app.use(cookieparser())

//Init firbase admin    
InitFirebase()

app.use("/api/v1",V1)

app.get("/api/",(req,res)=>{
    return res.send("Hii")
})

app.use(ErrHandler.HandleHttpErrors)


app.listen((process.env.SERVER_PORT),()=>{
    console.log('Serving at port',process.env.SERVER_PORT)
})

app.on('uncaughtException',(excp)=>{
    console.error("Uncaught",excp)
})
