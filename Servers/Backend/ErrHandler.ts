import {Response,Request, NextFunction} from "express"
import { BaseError, DataError, HTTPError, ValidationError } from "./lib/Error"
const HandleHttpErrors = (error: Error,req: Request,res: Response,next: NextFunction)=>{
    console.log('ERR catched by custom handler',error)
    var status : string | number | undefined = 500
    if(error instanceof ValidationError){
        const val_error = <ValidationError>error
        if(val_error.hide)
            return;
        if(val_error.status)
            status = val_error.status
    }
    if(error instanceof DataError){
        const data_error = <DataError>error

        if(data_error.hide)
            return;
            if(data_error.status)
            status = data_error.status
    }
    if(error instanceof HTTPError){
        const http_error = <HTTPError>error

        if(http_error.hide)
            return;
            if(http_error.status)
            status = http_error.status
    }
    if(status)
        return res.status(<number>status).json({
            error: {
                message: error.message
            }
        })
    if(process.env.NODE_ENV === 'development'){
        return res.status(500).json({
            error: error
        })
    }else{
        return res.status(500).json({
            error: {
                message: "Internal Server Error"
            }
        })
    }
}

export default {
    HandleHttpErrors
}