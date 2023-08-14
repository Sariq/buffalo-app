import { makeAutoObservable, runInAction } from "mobx";
import { axiosInstance } from "../../utils/http-interceptor";
import { STORE_API } from "../../consts/api";
import { fromBase64, toBase64 } from "../../helpers/convert-base64";

class StoreDataStore {
  paymentCredentials = null;
  storeData = null;
  selectedStore = null;

  constructor() {
    makeAutoObservable(this);

  }

  setSelectedStore = (value) => {
    this.selectedStore = value;
  }

  getStoreDataFromServer = async (storeId) => {
    console.log("storeId",storeId)
    const body = { datetime: new Date(), store_id: storeId };
    console.log(toBase64(body))
    return axiosInstance
      .post(
        `${STORE_API.CONTROLLER}/${STORE_API.GET_STORE_API}`,
        toBase64(body),
      )
      .then(function (response) {
        const res = JSON.parse(fromBase64(response.data));
        console.log("STORE",res)
        return res;
      }).catch((error) => {
        console.log(error);
      })
  };

  getStoreData = (storeId) => {
    return this.getStoreDataFromServer(storeId).then((res) => {
      runInAction(() => {
        this.storeData = res.stores[0];
        this.paymentCredentials = JSON.parse(fromBase64(res.stores[0].credentials));
      })
      return res.stores[0];
    })
  };
}

export const storeDataStore = new StoreDataStore();
