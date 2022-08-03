import { createContext } from "react";

export const OrderContext = createContext([{cart: [{food: []}],tokens:[]},null,null])
export const NotificationsContext = createContext([null,null])