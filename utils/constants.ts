/** Override with `EXPO_PUBLIC_API_URL` in `.env` (must include `/api` prefix) */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  "https://nodejs-production-cd4b6.up.railway.app/api";

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "@power-app/access_token",
  REFRESH_TOKEN: "@power-app/refresh_token",
} as const;

/** Paths relative to `API_BASE_URL` (e.g. …/api + /auth/sign-in) */
export const API_PATHS = {
  SIGN_IN: "/auth/sign-in",
  SIGN_OUT: "/auth/sign-out",
  REFRESH: "/auth/refresh-token",
  ME: "/users/me",
  ROLL_CALL_HISTORY: "/roll-call/history",
  /** Danh sách yêu cầu thay đổi tình trạng (GET) */
  STATUS_CHANGE_REQUESTS: "/status-change-requests",
  /** Danh sách giải trình lịch tập (GET, query: month, year) */
  SCHEDULE_EXPLANATIONS: "/schedule-explanations",
} as const;
