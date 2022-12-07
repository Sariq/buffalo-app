import axios from "axios";
import { BASE_URL } from "../../consts/api";
import { authStore } from "../../stores/auth";
import { StoreContext } from "../../stores";
import React from "react";
export const axiosInstance = axios.create({
    baseURL: BASE_URL + '/',
});

axiosInstance.interceptors.request.use(
    function (config) {
        const token = authStore.userToken;
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