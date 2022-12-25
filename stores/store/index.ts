import { makeAutoObservable } from "mobx";
import { axiosInstance } from "../../utils/http-interceptor";
import { STORE_API } from "../../consts/api";
import { fromBase64, toBase64 } from "../../helpers/convert-base64";

class StoreDataStore {
  userToken = null;
  verifyCodeToken = null;

  constructor() {
    makeAutoObservable(this);
    this.getStoreDataFromServer();
  }
  
  getStoreDataFromServer = async () => {
        const body = {datetime: new Date()};
        return axiosInstance
          .post(
            `${STORE_API.CONTROLLER}/${STORE_API.GET_STORE_API}`,
           toBase64(body),
          )
          .then(function (response) {
            const res = JSON.parse(fromBase64(response.data));
            return res;
          });
  
  };

}

export const storeDataStore = new StoreDataStore();
