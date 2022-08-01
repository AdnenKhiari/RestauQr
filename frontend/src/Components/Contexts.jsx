import { createContext } from "react";

export const OrderContext = createContext([{cart: [{food: []}]},null,null])