import axios from "axios";
import { BASE_URL } from "../../consts/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
        // Do something with request error
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        return Promise.reject(error);
    }
);