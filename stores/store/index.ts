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

  getStoreDataFromServer = async () => {
    const body = { datetime: new Date() };
    return axiosInstance
      .post(
        `stores/getstoreslist`,
        toBase64(body),
      )
      .then(function (response) {
        const res = JSON.parse(fromBase64(response.data));
        return res;
      }).catch((error) => {
        console.log(error);
      })
  };

  getStoreData = (storeId) => {
    return this.getStoreDataFromServer().then((res) => {
      runInAction(() => {
        this.storeData = res.stores_list.find((store)=> store.id == storeId);

        // this.paymentCredentials = JSON.parse(fromBase64(res.stores[0].credentials));
      })
      return res.stores_list.find((store)=> store.id == storeId);
    })
  };

  getPaymentCredentialsFromServer = async (storeId) => {
    const body = { datetime: new Date(), store_id: storeId };
    return axiosInstance
      .post(
        `stores/getstorecreditcardterminalcredentials`,
        toBase64(body),
      )
      .then(function (response) {
        const res = JSON.parse(fromBase64(response.data));
        return res;
      }).catch((error) => {
        console.log(error);
      })
  };

  getPaymentCredentials = (storeId) => {
    return this.getPaymentCredentialsFromServer(storeId).then((res) => {
      runInAction(() => {
        this.paymentCredentials = fromBase64(res.credentials);
      })
      return res;
    })
  };
}

export const storeDataStore = new StoreDataStore();
