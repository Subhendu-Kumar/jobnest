import axios from "axios";
import { BASE_URL } from "@/config";
import { router } from "expo-router";
import { clearUserData, getToken } from "@/lib/utils";

const API = axios.create({
  baseURL: BASE_URL,
});

API.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await clearUserData();
      router.replace("/signin");
    }
    return Promise.reject(error);
  }
);

export default API;
