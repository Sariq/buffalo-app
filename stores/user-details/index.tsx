import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeAutoObservable, runInAction } from "mobx";
import { axiosInstance } from "../../utils/http-interceptor";
import { AUTH_API } from "../../consts/api";
import { fromBase64, toBase64 } from "../../helpers/convert-base64";

type TUserDetails = {
  name: string;
  phone: string;
};

class UserDetailsStore {
  userDetails = null;

  constructor() {
    makeAutoObservable(this);
    this.getUserDetails();
  }


  printUser = () => {
    console.log("printUser:", this.getUserDetails())

  }

  getUserDetailsFromServer = () => {
    const body = { datetime: new Date() };
    return axiosInstance
      .post(
        `${AUTH_API.CONTROLLER}/${AUTH_API.GET_USER_DETAILS}`,
        toBase64(body),
      )
      .then(function (response) {
        const res = JSON.parse(fromBase64(response.data));

        return res;
      });
  };

  getUserDetails = () => {
    this.getUserDetailsFromServer().then((res)=>{
      const userDetailsTmp: TUserDetails = {
        name: res.name,
        phone: res.phone
      }
      runInAction(() => {
        this.userDetails = userDetailsTmp;
      });
      console.log(res)
    })
  };

}

export const userDetailsStore = new UserDetailsStore();
