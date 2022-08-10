import Express from "express";
import dotenv from "dotenv"
import V1 from "./Controller/v1"
import bodyParser from "body-parser"
const app = Express()
if(process.env.NODE_ENV !== 'production'){
    dotenv.config()
}

//to parse body from requests
app.use(bodyParser.json())

//initiliase the admin sdk

app.use("/v1",V1)

app.get("/",(req,res)=>{
    return res.send("Hii")
})

app.listen((process.env.SERVER_PORT),()=>{
    console.log('Serving at port',process.env.SERVER_PORT)
})

app.on('uncaughtException',(excp)=>{
    console.error(excp)
})

app.on('SIGTERM',()=>{
    process.kill(process.pid,'SIGTERM')
    console.error('TERMINATED')
})