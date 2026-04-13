import axios from "axios";
import { API_BASE_URL, DEFAULT_ACCESS_TOKEN } from "@/utils/constants";
import { attachAxiosDebugLog } from "./axiosDebugLog";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30_000,
});

attachAxiosDebugLog(apiClient, "apiClient", "full");

apiClient.interceptors.request.use(async (config) => {
  if (DEFAULT_ACCESS_TOKEN) {
    config.headers.Authorization = `Bearer ${DEFAULT_ACCESS_TOKEN}`;
  }
  return config;
});
