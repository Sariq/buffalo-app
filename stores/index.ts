import { createContext } from "react";
import { cartStore } from "./cart";
import { authStore } from "./auth";
import { menuStore } from "./menu";
import { languageStore } from "./language";

export const StoreContext = createContext({ 
    cartStore: cartStore, 
    authStore: authStore, 
    menuStore: menuStore, 
    languageStore: languageStore, 
    globalStyles: { fontFamily: "" } 
});