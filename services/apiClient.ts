import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL, API_PATHS } from "@/utils/constants";
import { attachAxiosDebugLog } from "./axiosDebugLog";
import { getAccessToken } from "./tokenService";
import { refreshAccessToken } from "./refreshService";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30_000,
});

attachAxiosDebugLog(apiClient, "apiClient", "request");

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

function shouldSkipAuthRefresh(config: InternalAxiosRequestConfig): boolean {
  const u = config.url ?? "";
  return u.includes(API_PATHS.REFRESH) || u.includes(API_PATHS.SIGN_IN);
}

apiClient.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
type QueueItem = {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
};
let failedQueue: QueueItem[] = [];

function resolveQueue(token: string) {
  failedQueue.forEach(({ resolve }) => resolve(token));
  failedQueue = [];
}

function rejectQueue(err: unknown) {
  failedQueue.forEach(({ reject }) => reject(err));
  failedQueue = [];
}

apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig | undefined;
    const status = error.response?.status;

    if (status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    if (shouldSkipAuthRefresh(originalRequest)) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      try {
        const token = await new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
        originalRequest.headers.Authorization = `Bearer ${token}`;
        originalRequest._retry = true;
        return apiClient(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const newAccess = await refreshAccessToken();
      resolveQueue(newAccess);
      originalRequest.headers.Authorization = `Bearer ${newAccess}`;
      return apiClient(originalRequest);
    } catch (err) {
      rejectQueue(err);
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  },
);
