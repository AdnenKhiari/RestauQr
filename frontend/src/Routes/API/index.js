const base_url = "http://localhost:8080/v1/"
const APIROUTES = {
    ADD_UPDATE_ORDER : base_url+"orders/clientOrder",
    GET_FOOD : base_url+"food",
    GET_CATEGORIES : base_url+"categories",
    GET_TABLE_BY_ID: (id)=> base_url+"tables/" + id,
    GET_FOOD_BY_ID : (id) => base_url+"food/"+id,
    GET_ORDER_BY_ID : (id) => base_url+"orders/"+id,
    GET_CURRENT_ORDER_BY_TABLE : (tableid) => base_url+"orders/clientOrder/"+tableid,
    REMOVE_ORDER : (orderid,subid) => base_url+"orders/clientOrder/"+orderid+"/"+subid,
    ADD_TOKEN_TO_CURRENT: (orderid) => base_url+"pushnot/"+orderid,
}
export default APIROUTES