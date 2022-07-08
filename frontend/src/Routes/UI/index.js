export const FOOD_DETAILS = "food/details/:id"
export const GET_FOOD_DETAILS = (tableid,cart_num)=> "/"+tableid+"/food/details/"+cart_num
export const CART_DETAILS = "cart"
export const FOOD_UPDATE = ":cartid"
export const GET_FOOD_UPDATE = (tableid,id)=> "/"+tableid+"/cart/"+id