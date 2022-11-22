import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeAutoObservable } from "mobx";

class AuthStore {
  userToken = null;
  verifyCodeToken = null;

  constructor() {
    makeAutoObservable(this);

    this.getUserToken();
  }
  getUserToken = async () => {
    const token = await AsyncStorage.getItem("@storage_userToken");
    console.log("getD",token)
    this.setUserToken(token);
  };

  setUserToken = (value) => {
    this.userToken = value;
  };
  setVerifyCodeToken = (value) => {
    console.log("setVerifyCodeToken", value)
    this.verifyCodeToken = value;
  };

  updateUserToken = async (token) => {
    try {
      console.log("xx",token)
      await AsyncStorage.setItem("@storage_userToken", token);
      setUserToken(token)
    } catch (e) {
      // saving error
    }
  };
}

export default AuthStore;
