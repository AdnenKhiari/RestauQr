declare namespace Express {
   interface Request {
     orderid?: string;
     productid?: string;
     user: any,
     decodedtoken: any
    }
 }