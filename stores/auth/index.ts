import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeAutoObservable, runInAction } from "mobx";
import { ordersStore } from "../orders";
import { axiosInstance } from "../../utils/http-interceptor";
import { AUTH_API } from "../../consts/api";
import { toBase64, fromBase64 } from "../../helpers/convert-base64";
import { cartStore } from "../cart";

class AuthStore {
  userToken = null;
  verifyCodeToken = null;

  constructor() {
    makeAutoObservable(this);
    this.getUserToken();
  }

  isLoggedIn = () => {
    return !!this.userToken;
  }

  getUserToken = async () => {
    const token = await AsyncStorage.getItem("@storage_userToken");
    this.setUserToken(token);
  };
  setUserToken = (value) => {
    this.userToken = value;
  };
  setVerifyCodeToken = (value) => {
    this.verifyCodeToken = value;
  };
  updateUserToken = async (token) => {
    try {
      await AsyncStorage.setItem("@storage_userToken", token);
      this.setUserToken(token);
    } catch (e) {
      // saving error
    }
  };

  logOutFromServer = () => {
    const body = { datetime: new Date() };
    return axiosInstance
      .post(
        `${AUTH_API.CONTROLLER}/${AUTH_API.LOGOUT_API}`,
        body,
      )
      .then(function (response) {
        const res = JSON.parse(fromBase64(response.data));
        return res;
      });
  }
  deleteAccountFromServer = () => {
    const body = { datetime: new Date() };
    return axiosInstance
      .post(
        `${AUTH_API.CONTROLLER}/${AUTH_API.DELETE_ACOOUNT_API}`,
        body,
      )
      .then(function (response) {
        const res = JSON.parse(fromBase64(response.data));
        return res;
      });
  }

  logOut = async () => {
    return new Promise((resolve) => {
      this.logOutFromServer().then((res) => {
        runInAction(async () => {
          ordersStore.resetOrdersList();
          await AsyncStorage.removeItem("@storage_userToken");
          this.userToken = null
          cartStore.resetCart();
          resolve(true);
        })
      });
    })
  }
  deleteAccount = () => {
    return new Promise((resolve) => {
      this.deleteAccountFromServer().then((res) => {
        runInAction(async () => {
          ordersStore.resetOrdersList();
          await AsyncStorage.removeItem("@storage_userToken");
          this.userToken = null
          cartStore.resetCart();
          resolve(true);
        })
      })
    });
  }
}

export const authStore = new AuthStore();
