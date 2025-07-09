import { makeAutoObservable, runInAction } from "mobx";
import { axiosInstance, axiosInstanceSari } from "../../utils/http-interceptor";
import { STORE_API } from "../../consts/api";
import { fromBase64, toBase64 } from "../../helpers/convert-base64";

class StoreDataStore {
  paymentCredentials = null;
  paymentCredentialsKey = null;
  storeData = null;
  selectedStore = "1";
  disabledAreas = {
    header: false,
    footer: false,
  }

  constructor() {
    makeAutoObservable(this);

  }

  setSelectedStore = (value) => {
    this.selectedStore = value;
  }
  setPaymentCredentialsKey = (value) => {
    this.paymentCredentialsKey = value;
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
        if(res.credentials){
          this.paymentCredentials = JSON.parse(fromBase64(res.credentials));
        }
      })
      return res;
    })
  };

   onDisableAreas = (data:any) =>{
    this.disabledAreas = {
      ...this.disabledAreas,
      ...data
    }
  }

  isUpdateAppVersionFromServer = async () => {
    return axiosInstanceSari
      .get(`${STORE_API.IS_UPDATE_VERSION_STORE_API}`)
      .then(function (response) {
        const res = response;
        return res;
      }).catch((error) => {
        console.log(error);
      })
  };

  isUpdateAppVersion = () => {
    return this.isUpdateAppVersionFromServer().then((res:any) => {
      return res
    })
  };
}

export const storeDataStore = new StoreDataStore();
