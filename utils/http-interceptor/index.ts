import axios from "axios";
import { BASE_URL, SARI_BASE_URL} from "../../consts/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fromBase64, toBase64 } from "../../helpers/convert-base64";
import { DeviceEventEmitter } from "react-native";
import { isEmpty, isObject } from "lodash";
import Constants from "expo-constants";

const general_errors_codes = ["-400", "-6", "-7", "-10", "-11", "-401"];
const TOKEN_NOT_VALID = -12;
export const axiosInstance = axios.create({
  baseURL: BASE_URL + "/",
  timeout:30000
});
export const axiosInstanceSari = axios.create({
  baseURL: SARI_BASE_URL + "/",
  timeout:30000
});

axiosInstance.interceptors.request.use(
  async function (config) {
    if (!isEmpty(config.data)) {
      const parsedData: any = JSON.parse(fromBase64(config.data));
      if (isObject(parsedData)) {
        const version = Constants.nativeAppVersion;
        config.data = toBase64({ ...parsedData, app_version: version });
      }
    }

    const token = await AsyncStorage.getItem("@storage_userToken");
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  function (error) {
    if(error?.message?.includes('Network Error')){
      DeviceEventEmitter.emit(`OPEN_INTERNET_CONNECTION_DIALOG`, {
        show: true,
        isSignOut: false,
      });
    }
    if(error?.message?.includes('timeout')){
      DeviceEventEmitter.emit(`OPEN_GENERAL_SERVER_ERROR_DIALOG`, {
        show: true,
        isSignOut: false,
      });
    }
    // Do something with request error
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    const jsonValue: any = JSON.parse(fromBase64(response.data));
    if (
      jsonValue.has_err &&
      general_errors_codes.indexOf(jsonValue.code) > -1
    ) {
      DeviceEventEmitter.emit(`OPEN_GENERAL_SERVER_ERROR_DIALOG`, {
        show: true,
        isSignOut: true,
      });
    }
    if (jsonValue.has_err && jsonValue.code === TOKEN_NOT_VALID) {
      DeviceEventEmitter.emit(`OPEN_GENERAL_SERVER_ERROR_DIALOG`, {
        show: true,
        isSignOut: true,
      });
    }
    return response;
  },
  function (error) {
    if(error?.message?.includes('Network Error')){
      DeviceEventEmitter.emit(`OPEN_INTERNET_CONNECTION_DIALOG`, {
        show: true,
        isSignOut: false,
      });
    }
    if(error?.message?.includes('timeout') || error?.message?.includes('Network Error')){
      DeviceEventEmitter.emit(`OPEN_GENERAL_SERVER_ERROR_DIALOG`, {
        show: true,
        isSignOut: false,
      });
    }
    return Promise.reject(error);
  }
);

// SARI
axiosInstanceSari.interceptors.request.use(
  async function (config) {
    const token = await AsyncStorage.getItem("@storage_userToken");
    if (token) {
      config.headers["Authorization"] = "Token " + token;
    }
    if (config.headers["Content-Type"] !== "multipart/form-data") {
      config.headers["Content-Type"] = "application/json";
    }

    const version = Constants.nativeAppVersion;
    config.headers["app-version"] = version;
    
    config.headers["app-name"] = 'buffalo'

    return config;
  },
  function (error) {
    if (error?.message?.includes("Network Error")) {
      DeviceEventEmitter.emit(`OPEN_INTERNET_CONNECTION_DIALOG`, {
        show: true,
        isSignOut: false,
      });
    }
    if (error?.message?.includes("timeout")) {
      DeviceEventEmitter.emit(`OPEN_GENERAL_SERVER_ERROR_DIALOG`, {
        show: true,
        isSignOut: false,
      });
    }
    // Do something with request error
    return Promise.reject(error);
  }
);

axiosInstanceSari.interceptors.response.use(
  function (response: any) {
    if (
      response.has_err &&
      general_errors_codes.indexOf(response.error_code) > -1
    ) {
      //DeviceEventEmitter.emit(`OPEN_GENERAL_SERVER_ERROR_DIALOG`, { show: true, isSignOut: true });
    }
    // const jsonValue:any = JSON.parse(fromBase64(response.data));
    // if(response.has_err && general_errors_codes.indexOf(response.error_code) > -1){
    //     DeviceEventEmitter.emit(`OPEN_GENERAL_SERVER_ERROR_DIALOG`, { show: true, isSignOut: true });
    // }
    // if(jsonValue.has_err && jsonValue.code === TOKEN_NOT_VALID){
    //     DeviceEventEmitter.emit(`OPEN_GENERAL_SERVER_ERROR_DIALOG`, { show: true, isSignOut: true });
    // }
    return response.data;
  },
  function (error) {
    if (error?.message?.includes("Network Error")) {
      DeviceEventEmitter.emit(`OPEN_INTERNET_CONNECTION_DIALOG`, {
        show: true,
        isSignOut: false,
      });
    }
    if (
      error?.message?.includes("timeout") ||
      error?.message?.includes("Network Error")
    ) {
      DeviceEventEmitter.emit(`OPEN_GENERAL_SERVER_ERROR_DIALOG`, {
        show: true,
        isSignOut: false,
      });
    }
    if (error?.message?.includes("401")) {
      DeviceEventEmitter.emit(`OPEN_GENERAL_SERVER_ERROR_DIALOG`, {
        show: true,
        isSignOut: true,
      });
    }
    if (error?.message?.includes("402")) {
      DeviceEventEmitter.emit(`OPEN_GENERAL_SERVER_ERROR_DIALOG`, {
        show: true,
        isSignOut: true,
      });
    }
    // console.log(error)
    return Promise.reject(error);
  }
);
