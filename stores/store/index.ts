import { makeAutoObservable, runInAction } from "mobx";
import { axiosInstance } from "../../utils/http-interceptor";
import { STORE_API } from "../../consts/api";
import { fromBase64, toBase64 } from "../../helpers/convert-base64";

class StoreDataStore {
  paymentCredentials = null;
  storeData = null;

  constructor() {
    makeAutoObservable(this);
    
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
          })
  };

  getStoreData = () => {
    return this.getStoreDataFromServer().then((res) => {
      runInAction(()=>{
        this.storeData = res.stores[0];
        this.paymentCredentials = JSON.parse(fromBase64(res.stores[0].credentials));
        console.log(this.paymentCredentials)

      })
    })
  };
}

export const storeDataStore = new StoreDataStore();
