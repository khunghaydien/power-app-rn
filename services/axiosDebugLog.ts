import axios, { type AxiosError, type AxiosInstance } from "axios";

type LogMode = "request" | "full";

/**
 * In development, logs HTTP calls. `request` = chỉ URL (an toàn với interceptor 401 phức tạp).
 * Xem log ở terminal Metro (`npx expo start`) hoặc Logcat / Xcode console.
 */
export function attachAxiosDebugLog(
  client: AxiosInstance,
  tag: string,
  mode: LogMode = "full",
): void {
  if (!__DEV__) return;

  client.interceptors.request.use((config) => {
    const method = (config.method ?? "get").toUpperCase();
    let url: string;
    try {
      url = axios.getUri(config);
    } catch {
      url = `${config.baseURL ?? ""}${config.url ?? ""}`;
    }
    console.log(`[HTTP ${tag}] → ${method} ${url}`);
    return config;
  });

  if (mode === "request") return;

  client.interceptors.response.use(
    (response) => {
      const method = (response.config.method ?? "get").toUpperCase();
      let url: string;
      try {
        url = axios.getUri(response.config);
      } catch {
        url = `${response.config.baseURL ?? ""}${response.config.url ?? ""}`;
      }
      console.log(
        `[HTTP ${tag}] ← ${response.status} ${method} ${url}`,
      );
      try {
        const preview = JSON.stringify(response.data);
        console.log(
          `[HTTP ${tag}] data`,
          preview.length > 1200 ? `${preview.slice(0, 1200)}...` : preview,
        );
      } catch {
        console.log(`[HTTP ${tag}] data`, response.data);
      }
      return response;
    },
    (error: AxiosError) => {
      const cfg = error.config;
      const status = error.response?.status;
      if (cfg) {
        const method = (cfg.method ?? "get").toUpperCase();
        let url: string;
        try {
          url = axios.getUri(cfg);
        } catch {
          url = `${cfg.baseURL ?? ""}${cfg.url ?? ""}`;
        }
        console.warn(
          `[HTTP ${tag}] ✕ ${status ?? "NETWORK"} ${method} ${url}`,
          error.message,
        );
        if (error.response?.data !== undefined) {
          try {
            const preview = JSON.stringify(error.response.data);
            console.warn(
              `[HTTP ${tag}] error-data`,
              preview.length > 1200 ? `${preview.slice(0, 1200)}...` : preview,
            );
          } catch {
            console.warn(`[HTTP ${tag}] error-data`, error.response.data);
          }
        }
      } else {
        console.warn(`[HTTP ${tag}] ✕`, error.message);
      }
      return Promise.reject(error);
    },
  );
}
