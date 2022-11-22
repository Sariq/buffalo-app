import {createContext} from "react";
import CartStore from "./cart";
import AuthStore from "./auth";
import MenuStore from "./menu";

export const StoreContext = createContext({cartStore: new CartStore(), AuthStore: new AuthStore(), MenuStore: new MenuStore()});