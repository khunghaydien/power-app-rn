import axios from "axios";
import { attachAxiosDebugLog } from "./axiosDebugLog";
import { API_BASE_URL, API_PATHS } from "@/utils/constants";
import { apiClient } from "./apiClient";
import { queryClient } from "./queryClient";
import { useAuthStore } from "@/stores/useAuthStore";
import { clearTokens, setTokens } from "./tokenService";
import {
  toUser,
  type ApiUserPayload,
  type User,
} from "./userMapper";

export type { User };

export type SignInCredentials = {
  email: string;
  password: string;
};

export type SignInResponse = {
  accessToken: string;
  refreshToken: string;
};

type SignInApiResponse = {
  user: ApiUserPayload;
  accessToken: string;
  refreshToken: string;
};

export class AuthService {
  private readonly publicClient = (() => {
    const c = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30_000,
    });
    attachAxiosDebugLog(c, "sign-in");
    return c;
  })();

  /** Uses public axios client so no stale Bearer is sent */
  async signIn(credentials: SignInCredentials): Promise<SignInResponse> {
    const { data } = await this.publicClient.post<SignInApiResponse>(
      API_PATHS.SIGN_IN,
      credentials,
    );
    await setTokens({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });
    useAuthStore.getState().setUser(toUser(data.user));
    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
  }

  async signOut(): Promise<void> {
    // No working logout route on current API — clear session locally only
    await clearTokens();
    useAuthStore.getState().setUser(null);
    queryClient.clear();
  }

  async getMe(): Promise<User> {
    const { data } = await apiClient.get<ApiUserPayload>(API_PATHS.ME);
    return toUser(data);
  }
}

export const authService = new AuthService();
