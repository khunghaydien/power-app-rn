import { API_PATHS } from "@/utils/constants";
import { apiClient } from "./apiClient";

export type User = {
  id: string;
  employeeCode: string | null;
  employeeFullname: string | null;
  gender: string | null;
  region: string | null;
  department: string | null;
  trainingStartDate: string | null;
  avatarUrl: string | null;
};


export class AuthService {
  async getMe(): Promise<User> {
    const { data } = await apiClient.get<User>(API_PATHS.ME);
    return data;
  }
}

export const authService = new AuthService();
