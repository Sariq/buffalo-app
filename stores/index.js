import {createContext} from "react";
import CartStore from "./cart";

export const StoreContext = createContext({cartStore: new CartStore()});