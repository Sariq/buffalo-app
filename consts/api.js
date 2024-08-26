export const SITE_URL = "https://api.buffaloburger.co.il/";
export const BASE_URL = "https://api.buffaloburger.co.il/api";
export const SARI_BASE_URL = "https://sari-apps-lcibm.ondigitalocean.app/api";
// export const SARI_BASE_URL = "http://10.0.0.6:1111/api";

export const AUTH_API = {
    CONTROLLER: "Authenticator",
    AUTHINTICATE_API : "Authenticate",
    VERIFY_API : "Verify",
    UPDATE_CUSTOMER_NAME_API : "UpdateCustomerName",
    GET_USER_DETAILS: "GetCustomerInfo",
    LOGOUT_API: "Logout",
    DELETE_ACOOUNT_API: "DeleteAccount"
};
export const MENU_API = {
    CONTROLLER: "config",
    //GET_MENU_API : "GetRestaurantMenu",
    GET_MENU_API : "getstoremenu",
    GET_SLIDER_API : "getAppSliderGallery",
};
export const ORDER_API = {
    CONTROLLER: "order",
    SUBMIT_ORDER_API : "submit",
    SUBMIT_ORDER_API_SARI : "create",
    GET_STATUS_API: "GetStatus",
    UPDATE_CCPAYMENT_API: "UpdateCCPayment",
    IS_VALID_GEO_API: "IsValidGeo",
    GET_ORDERS_API : "getorders",
};
export const STORE_API = {
    CONTROLLER: "stores",
    GET_STORE_API : "getstoreslist",
    IS_UPDATE_VERSION_STORE_API : "store/is-should-update",
};

export const UTILITIES_API = {
    CONTROLLER: "Utilities",
    GET_ORDERS_API : "getOrders",
}
