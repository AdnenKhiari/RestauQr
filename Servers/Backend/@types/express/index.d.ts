declare namespace Express {
   interface Request {
     orderid?: string;
     productid?: string;
     supplierid?: string,
     user?: any,
     decodedtoken?: any,
     rawBody?: string | Buffer 
    }
 }
