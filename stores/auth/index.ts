import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeAutoObservable } from "mobx";

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
      this.setUserToken(token)
    } catch (e) {
      // saving error
    }
  };
}

export const authStore = new AuthStore();
