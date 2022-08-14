import {Response,Request, NextFunction} from "express"
const HandleHttpErrors = (error: Error,req: Request,res: Response,next: NextFunction)=>{
    console.error('ERR',error)
   /* return res.status(500).json({
        error: "Internal Server Error"
    })*/
    return res.status(500).json({
        error: error
    })
}

export default {
    HandleHttpErrors
}