export const ORDERS = {
    ALL : "/orders",
    ACCOMPLISHED : "/suborders/accomplished",
    PENDING : "/suborders/pending",
    WAITING : "/suborders/waiting",
    CANCELED : "/suborders/canceled",
    REVIEW: "/orders/:orderid",
    SUBREVIEW: "/suborders/:orderid/:subid",
    GET_SUBREVIEW : (orderid,id)=>"/suborders/"+orderid+"/"+id,
    GET_REVIEW : (id)=>"/orders/"+id
}
export const SUPPLIERS = {
    ALL : "/suppliers",
    GET_UPDATE_SUPPLIER: (id)=> "/suppliers/update/" + id,
    UPDATE_SUPPLIER:  "/suppliers/update/:supplierid",
    REVIEW_SUPPLIER: "/suppliers/:supplierid",
    ADD_SUPPLIER : "/suppliers/add",
    GET_SUPPLIER : (id)=>"/suppliers/"+id
}
/*
export const INVENTORY = {
    ALL : "/inventory",
    REVIEW_PRODUCT: "/inventory/:productid",
    ALL_ORDERS: "/inventory/orders",
    ALL_PRODUCT_ORDERS: "/inventory/:productid/orders",
    REVIEW_PRODUCT_ORDER: "/inventory/:productid/orders/:orderid",
    UPDATE_PRODUCT_ORDER: "/inventory/:productid/orders/update/:orderid",
    UPDATE_PRODUCT : "/inventory/update/:productid",
    ADD_PRODUCT : "/inventory/add",
    ADD_PRODUCT_ORDER: "/inventory/:productid/orders/add",
    GET_ADD_PRODUCT_ORDER : (id)=> "/inventory/"+id+"/orders/add",
    GET_UPDATE_PRODUCT : (id)=> "/inventory/update/" + id,
    GET_REVIEW_PRODUCT : (id)=>"/inventory/"+id,
    GET_UPDATE_PRODUCT_ORDER : (productid,orderid)=>"/inventory/"+productid+"/orders/update/"+orderid,
    GET_REVIEW_PRODUCT_ORDER : (productid,orderid)=>"/inventory/"+productid+"/orders/"+orderid
}
*/

export const INVENTORY = {
    ALL : "/inventory",
    REVIEW_PRODUCT: "/inventory/:productid",
    ALL_MERCHANDISE :"/inventory/merchandise",
    ALL_PRODUCT_MERCHANDISE: "/inventory/:productid/merchandise",
    REVIEW_PRODUCT_MERCHANDISE: "/inventory/:productid/merchandise/:orderid",
    UPDATE_PRODUCT_MERCHANDISE: "/inventory/:productid/merchandise/update/:orderid",
    UPDATE_PRODUCT : "/inventory/update/:productid",
    ADD_PRODUCT : "/inventory/add",
    ADD_PRODUCT_MERCHANDISE: "/inventory/:productid/merchandise/add",
    GET_ADD_PRODUCT_MERCHANDISE : (id)=> "/inventory/"+id+"/merchandise/add",
    GET_UPDATE_PRODUCT : (id)=> "/inventory/update/" + id,
    GET_REVIEW_PRODUCT : (id)=>"/inventory/"+id,
    GET_UPDATE_PRODUCT_MERCHANDISE : (productid,orderid)=>"/inventory/"+productid+"/merchandise/update/"+orderid,
    GET_REVIEW_PRODUCT_MERCHANDISE : (productid,orderid)=>"/inventory/"+productid+"/merchandise/"+orderid,
    TEMPLATES : {
        ADD_UPDATE_TEMPLATE : "/inventory/:productid/template/",
        GET_ADD_UPDATE_TEMPLATE : (productid)=> "/inventory/"+productid+"/template",
    }
}

export const PRODUCT_ORDERS = {
    ALL : "/suppliers/orders",
    GET_UPDATE_PRODUCT_ORDERS: (supid,orderid)=> "/suppliers/"+supid+"/orders/update/" + orderid,
    UPDATE_PRODUCT_ORDERS : "/suppliers/:supplierid/orders/update/:orderid",
    REVIEW_PRODUCT_ORDERS_BY_SUPPLIER: "/suppliers/:supplierid/orders",
    REVIEW_PRODUCT_ORDER_BY_SUPPLIER: "/suppliers/:supplierid/orders/update/:orderid",
    ADD_PRODUCT_ORDERS: "/suppliers/:supplierid/orders/add",
    ADD_PRODUCT_ORDER_TO_SUPPLIER : (supid)=> "/suppliers/"+supid+"/orders/add",
    GET_PRODUCT_ORDERS_OF_SUPPLIER : (supid)=> "/suppliers/"+supid+"/orders/",
    GET_PRODUCT_ORDERS_BY_ID : (supid,orderid)=> "/suppliers/"+supid+"/orders/update/" + orderid,

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
    CATEGORIES : "/categories",
    UNITS: "/units"
}
