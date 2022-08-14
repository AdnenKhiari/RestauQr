const base_url = "http://localhost:8080/v1/"
const APROUTES = {
    ADD_UPDATE_ORDER : base_url+"orders/clientOrder",
    GET_FOOD : base_url+"food",
    GET_FOOD_BY_ID : (id) => base_url+"food/"+id,
    GET_ORDER_BY_ID : (id) => base_url+"orders/"+id,
    GET_CURRENT_ORDER_BY_TABLE : (tableid) => base_url+"orders/table/"+tableid,
    REMOVE_CURRENT_ORDER_BY_TABLE : (tableid) => base_url+"orders/table/"+tableid,
    ADD_TOKEN_TO_CURRENT: (tableid) => base_url+"tokens/table/"+tableid,
    GET_TOKEN_TO_CURRENT: (tableid) => base_url+"tokens/table/"+tableid,

}
export default APROUTES