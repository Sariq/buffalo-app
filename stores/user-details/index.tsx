import { makeAutoObservable, runInAction } from "mobx";
import { axiosInstance } from "../../utils/http-interceptor";
import { AUTH_API } from "../../consts/api";
import { fromBase64, toBase64 } from "../../helpers/convert-base64";

type TUserDetails = {
  name: string;
  phone: string;
};

class UserDetailsStore {
  userDetails: TUserDetails = null;

  constructor() {
    makeAutoObservable(this);
    console.log("AAAA", this.userDetails)
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
        console.log("resUSerServe", res)
        return res;
      });
  };

  getUserDetails = () => {
    return this.getUserDetailsFromServer().then((res)=>{
      const userDetailsTmp: TUserDetails = {
        name: res.name,
        phone: res.phone
      }
      console.log("resUSer", res)

      runInAction(() => {
        this.userDetails = userDetailsTmp;
        console.log("AAAAxx", this.userDetails)

      });
    })
  };

}

export const userDetailsStore = new UserDetailsStore();
