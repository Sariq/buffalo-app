import {createContext} from "react";
import CartStore from "./cart";
import AuthStore from "./auth";
import MenuStore from "./menu";
import LanguageStore from "./language";

export const StoreContext = createContext({cartStore: new CartStore(), authStore: new AuthStore(), menuStore: new MenuStore(), languageStore: new LanguageStore(), globalStyles: {fontFamily: ""}});