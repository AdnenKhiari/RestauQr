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
