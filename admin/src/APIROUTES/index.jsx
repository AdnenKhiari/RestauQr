const baseurl = "http://localhost:8080/v1/"
export const AUTH = {
    SIGN_IN: baseurl+"auth/signin/",
    CREATE_PROFILE: baseurl+"auth/createProfile/",
    RECOVER_PASSWORD: baseurl+"auth/sendRecoverPassword",
    CONFIRM_VALID_EMAIL: baseurl+"auth/verifyEmailCode/",
    CONFIRM_VALID_PASSWORD: baseurl+"auth/verifyPasswordCode/",
    VALIDATE_EMAIL:  baseurl+"auth/sendValidateEmail/",
    LOGOUT: baseurl+"auth/logout/",

}
export const USERS = {
    DELETE_CURRENT :  baseurl+"users/current",
    GET_CURRENT_USER: baseurl+"users/current",
    GET_USERS : baseurl+"users/",
    GET_USER_BY_ID : (id)=> baseurl+"users/"+id,
    REMOVE_USER_BY_ID : (id)=> baseurl+"users/"+id,
    UPDATE_USER : (id)=> baseurl+"users/"+id,
}
export const FOOD = {
    GET_FOODS: baseurl+"food/",
    GET_FOOD_BY_ID : (id)=> baseurl+"food/"+id,
    ADD_FOOD: baseurl+"food/",
    UPDATE_FOOD: (id)=> baseurl+"food/"+id,
    REMOVE_FOOD: (id)=> baseurl+"food/"+id,
}
export const TABLES = {
    GET_TABLES: baseurl+"tables/",
    GET_TABLE_BY_ID : (id)=> baseurl+"tables/"+id,
    ADD_TABLE: baseurl+"tables/",
    UPDATE_TABLE: (id)=> baseurl+"tables/"+id,
    REMOVE_TABLE: (id)=> baseurl+"tables/"+id,
}
export const ORDERS = {
    GET_ORDERS: baseurl+"orders/",
    GET_ORDER_BY_ID : (id)=> baseurl+"orders/"+id,
    ADD_ORDER: baseurl+"orders/",
    UPDATE_ORDER: (id)=> baseurl+"orders/"+id,
    REMOVE_ORDER: (id)=> baseurl+"orders/"+id,
    SUB_ORDERS : {
        GET_SUB_ORDER_BY_ID : (orderid,subid)=> baseurl+"orders/"+orderid+"/suborders/"+subid,
        GET_SUB_ORDERS: baseurl+"orders/suborders",
        GET_SUB_ORDERS_OF_ORDER : (orderid)=> baseurl+"orders/"+orderid+"/suborders",
        ADD_SUB_ORDER:(orderid)=>  baseurl+"orders/" + orderid  + "/suborders",
        UPDATE_SUB_ORDER: (orderid,subid)=>  baseurl+"orders/" + orderid  + "/suborders/" + subid,
        REMOVE_SUB_ORDER: (orderid,subid)=>  baseurl+"orders/" + orderid  + "/suborders/" + subid,
    }
}
export const PRODUCTS = {
    GET_PRODUCTS: baseurl+"products/",
    GET_PRODUCT_BY_ID : (id)=> baseurl+"products/"+id,
    ADD_PRODUCT: baseurl+"products/",
    UPDATE_PRODUCT: (id)=> baseurl+"products/"+id,
    REMOVE_PRODUCT: (id)=> baseurl+"products/"+id,
    CONSUME_PRODUCT: (id)=> baseurl+"products/consume/"+id,

    PRODUCT_ORDERS : {
        GET_PRODUCT_ORDER_OF_PRODUCT_BY_ID: (productid,subid)=>  baseurl+"products/" + productid  + "/product_orders/" + subid,
        GET_PRODUCT_ORDERS: baseurl+"products/product_orders",
        GET_PRODUCT_ORDERS_OF_PRODUCT : (productid)=> baseurl+"products/"+productid+"/product_orders",
        ADD_PRODUCT_ORDER:(productid)=>  baseurl+"products/" + productid  + "/product_orders",
        UPDATE_PRODUCT_ORDER: (productid,subid)=>  baseurl+"products/" + productid  + "/product_orders/" + subid,
        REMOVE_PRODUCT_ORDER: (productid,subid)=>  baseurl+"products/" + productid  + "/product_orders/" + subid,
        CONSUME_PRODUCT_ORDER: (productid,subid)=>  baseurl+"products/" + productid  + "/product_orders/consume/" + subid,

    }
}
