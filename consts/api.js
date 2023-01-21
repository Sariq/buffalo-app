export const BASE_URL = "https://api.buffaloburger.co.il/api";
export const AUTH_API = {
    CONTROLLER: "Authenticator",
    AUTHINTICATE_API : "Authenticate",
    VERIFY_API : "Verify",
    UPDATE_CUSTOMER_NAME_API : "UpdateCustomerName",
    GET_USER_DETAILS: "GetCustomerInfo"
};
export const MENU_API = {
    CONTROLLER: "config",
    GET_MENU_API : "GetRestaurantMenu",
    GET_SLIDER_API : "getAppSliderGallery",
};
export const ORDER_API = {
    CONTROLLER: "order",
    SUBMIT_ORDER_API : "submit",
    GET_STATUS_API: "GetStatus",
    UPDATE_CCPAYMENT_API: "UpdateCCPayment",
    IS_VALID_GEO_API: "IsValidGeo",
    GET_ORDERS_API : "getorders",
};
export const STORE_API = {
    CONTROLLER: "Stores",
    GET_STORE_API : "getStores",
};

export const UTILITIES_API = {
    CONTROLLER: "Utilities",
    GET_ORDERS_API : "getOrders",
}
