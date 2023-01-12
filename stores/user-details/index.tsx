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
  isAcceptedTerms: boolean = false;
  constructor() {
    makeAutoObservable(this);
  }

  setIsAcceptedTerms = (flag: boolean) =>{
    this.isAcceptedTerms = flag;
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
    return this.getUserDetailsFromServer().then((res)=>{
      const userDetailsTmp: TUserDetails = {
        name: res.name,
        phone: res.phone
      }
      runInAction(() => {
        this.userDetails = userDetailsTmp;
      });
    })
  };

}

export const userDetailsStore = new UserDetailsStore();
