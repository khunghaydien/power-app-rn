import axios from "axios";
import { attachAxiosDebugLog } from "./axiosDebugLog";
import { API_BASE_URL, API_PATHS } from "@/utils/constants";
import { clearTokens, getRefreshToken, setTokens } from "./tokenService";

export type RefreshResponse = {
  accessToken: string;
  refreshToken?: string;
};

/** No auth interceptors — avoids refresh recursion */
const refreshClient = (() => {
  const c = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30_000,
  });
  attachAxiosDebugLog(c, "refresh");
  return c;
})();

let refreshChain: Promise<string> | null = null;

/** Refresh access token; concurrent callers share one in-flight request */
export function refreshAccessToken(): Promise<string> {
  if (!refreshChain) {
    refreshChain = performRefresh().finally(() => {
      refreshChain = null;
    });
  }
  return refreshChain;
}

async function performRefresh(): Promise<string> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    await clearTokens();
    throw new Error("No refresh token");
  }

  try {
    const { data } = await refreshClient.post<RefreshResponse>(
      API_PATHS.REFRESH,
      { refreshToken },
    );

    const nextRefresh = data.refreshToken ?? refreshToken;
    await setTokens({
      accessToken: data.accessToken,
      refreshToken: nextRefresh,
    });
    return data.accessToken;
  } catch {
    await clearTokens();
    throw new Error("Refresh failed");
  }
}
