export const ORDERS = {
    ALL : "/orders",
    ACCOMPLISHED : "/orders/accomplished",
    PENDING : "/orders/pending",
    WAITING : "/orders/waiting",
    CANCELED : "/orders/canceled",
    REVIEW: "/orders/:orderid",
    GET_REVIEW : (id)=>"/orders/"+id
}
export const INVENTORY = {
    ALL : "/inventory",
    REVIEW_PRODUCT: "/inventory/:productid",
    ALL_ORDERS: "/inventory/orders",
    ALL_PRODUCT_ORDERS: "/inventory/:productid/orders",
    REVIEW_PRODUCT_ORDER: "/inventory/:productid/orders/:orderid",
    GET_REVIEW_PRODUCT : (id)=>"/inventory/"+id,
    GET_REVIEW_PRODUCT_ORDER : (productid,orderid)=>"/inventory/"+productid+"/orders/"+orderid
}
export const AUTH = {
    SINGIN : "/auth/signin",
    SIGNUP : "/auth/signup",
    VALIDATE_EMAIL: "/auth/validateemail",
    RESET_PASSWORD: "/auth/resetpassword",
    INIT_PROFILE: "/auth/profile/create",
    ACTION_CODE_RESPONSE : "/auth/acr/*"
}

export const USERS = {
    MY_PROFILE: "/users/profile",
    ALL: "/users/",
    PROFILE: "/users/profile/:userid",
    GET_PROFILE : (id)=>"/users/profile/" + id
}
export const TABLES = {
    ALL : "/tables/",
    REVIEW : "/tables/:tableid",
    ADD : "/tables/add",
    //in update add remove button
    UPDATE : "/tables/update/:tableid",
    GET_UPDATE : (id)=> "/tables/update/"+id,
    GET_REVIEW : (id)=> "/tables/"+id
}

export const FOOD = {
    ALL : "/food/",
    REVIEW : "/food/:foodid",
    CATEGORIES : "/food/categories",
    ADD : "/food/add",
    //in update add remove button
    UPDATE : "/food/update/:foodid",
    GET_UPDATE : (id)=> "/food/update/"+id,
    GET_REVIEW : (id)=> "/food/"+id
}
export const OPTIONS = {
    MENU : "/options"
}
