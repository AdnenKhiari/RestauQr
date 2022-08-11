import express , {Express} from "express";
import dotenv from "dotenv"
import V1 from "./Controller/v1"
import bodyParser from "body-parser"
import { InitFirebase } from "./lib/firebase";
import cookieparser from "cookie-parser"
import ErrHandler from "./ErrHandler"
const app = express()

if(process.env.NODE_ENV !== 'production'){
    dotenv.config()    
}

//to parse body from requests
app.use(bodyParser.json());

//cookie parser for cookies
app.use(cookieparser())

//Init firbase admin    
InitFirebase()

app.use("/v1",V1)

app.get("/",(req,res)=>{
    return res.send("Hii")
})

app.use(ErrHandler.HandleHttpErrors)


app.listen((process.env.SERVER_PORT),()=>{
    console.log('Serving at port',process.env.SERVER_PORT)
})

app.on('uncaughtException',(excp)=>{
    console.error("Uncaught",excp)
})
