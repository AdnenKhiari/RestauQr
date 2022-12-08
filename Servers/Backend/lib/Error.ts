import { StatusCodes } from "http-status-codes";

interface error_result {
    message: string,
    payload: any,
    stack: string,
    timestamp: number,
    status?: string,
    [customOptions: string] : unknown
}

export class BaseError extends Error {
    payload: any;
    status?: string | number;
    hide: boolean;
    timestamp: number;
    constructor(message: string,payload?: any,status?: string | number,hide : boolean = false){
        super(message)
        Error.captureStackTrace(this, this.constructor);
        this.payload = payload
        this.hide = hide
        this.timestamp = Date.now()
        this.status = status
    }
    
    getErrorData (){
        return {
            message: this.message,
            payload: this.payload,
            stack : this.stack,
            timestamp: this.timestamp,
            status: this.status
        }
    }
}

export class DataError extends BaseError {
    constructor(message: string,payload: any,status?:  string | number,hide : boolean = false){
        super(message,payload,status || StatusCodes.UNPROCESSABLE_ENTITY,hide)
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends BaseError {
    joiStack?: string;
    constructor(message: string,payload: any,joiStack?: string,status?:  string | number,hide : boolean = false){
        super(message,payload,status || StatusCodes.BAD_REQUEST,hide)
        Error.captureStackTrace(this, this.constructor);
        this.joiStack = joiStack;
    }
}

export class HTTPError extends BaseError {
    constructor(message: string,payload: any,status?:  string | number,hide : boolean = false){
        super(message,payload,status,hide)
        Error.captureStackTrace(this, this.constructor);
    }
}