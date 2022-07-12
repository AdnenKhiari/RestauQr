export const ORDERS = {
    ALL : "/orders",
    ACCOMPLISHED : "/orders/accomplished",
    PENDING : "/orders/pending",
    WAITING : "/orders/waiting",
    CANCELED : "/orders/canceled",
    REVIEW: "/orders/:orderid",
    GET_REVIEW : (id)=>"/orders/"+id
}

export const FOOD = {
    ALL : "/food/",
    REVIEW : "/food/:id",
    ADD : "/food/add",
    //in update add remove button
    UPDATE : "/food/update"
}
