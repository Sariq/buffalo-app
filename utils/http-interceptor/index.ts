import axios from "axios";
import { BASE_URL } from "../../consts/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fromBase64 } from "../../helpers/convert-base64";
import { DeviceEventEmitter } from "react-native";
import { authStore } from "../../stores/auth";

const general_errors_codes = ['-400','-6','-7','-10','-11','-401'];
const TOKEN_NOT_VALID = -12;
export const axiosInstance = axios.create({
    baseURL: BASE_URL + '/',
});

axiosInstance.interceptors.request.use(
    async function (config) {
        const token = await AsyncStorage.getItem("@storage_userToken");
        console.log("axiosInstance", token)
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token
        }
        config.headers['Content-Type'] = 'application/json';
        return config;
    },
    function (error) {
        console.log("AXIOS-Request-Error", error)
        // Do something with request error
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    function (response) {
        const jsonValue:any = JSON.parse(fromBase64(response.data));
        if(jsonValue.has_err && general_errors_codes.indexOf(jsonValue.code) > -1){
            console.log(jsonValue)
            DeviceEventEmitter.emit(`OPEN_GENERAL_SERVER_ERROR_DIALOG`, { show: true });
        }
        if(jsonValue.has_err && jsonValue.code === TOKEN_NOT_VALID){
            authStore.logOut();
            DeviceEventEmitter.emit(`OPEN_GENERAL_SERVER_ERROR_DIALOG`, { show: true });
        }            
        return response;
    },
    function (error) {
        console.log("AXIOS-response-Error", error)

        return Promise.reject(error);
    }
);