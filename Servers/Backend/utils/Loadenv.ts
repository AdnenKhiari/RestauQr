import dotenv from "dotenv"
const LoadEnv = ()=>{
    if(process.env.NODE_ENV !== 'production'){
        const res = dotenv.config()    
        if(res.error)
            console.log("Env Error,",res.error)
        console.log("parsed",res.parsed)
    }
}
export default LoadEnv