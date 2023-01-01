import { createContext } from "react";
import { cartStore } from "./cart";
import { authStore } from "./auth";
import { menuStore } from "./menu";
import { languageStore } from "./language";
import { storeDataStore } from "./store";
import { userDetailsStore } from "./user-details";

export const StoreContext = createContext({ 
    cartStore: cartStore, 
    authStore: authStore, 
    menuStore: menuStore, 
    userDetailsStore: userDetailsStore,
    languageStore: languageStore, 
    storeDataStore: storeDataStore,
});