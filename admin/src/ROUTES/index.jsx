export const ORDERS = {
    ALL : "/orders",
    ACCOMPLISHED : "/orders/accomplished",
    PENDING : "/orders/pending",
    WAITING : "/orders/waiting",
    CANCELED : "/orders/canceled",
    REVIEW: "/orders/:orderid",
    GET_REVIEW : (id)=>"/orders/"+id
}
export const AUTH = {
    SINGIN : "/signin",
    SIGNUP : "/signup",
    VALIDATE_EMAIL: "/validateemail"
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
