function cleanBaseUrl(raw?: string): string {
  if (!raw) return "";
  return raw
    .trim()
    .replace(/^curl\s+/i, "")
    .replace(/^['"]|['"]$/g, "");
}

export const API_BASE_URL =
  cleanBaseUrl(process.env.EXPO_PUBLIC_API_URL) ||
  "https://betamysgr.sungroup.com.vn/api/v1/iis/hsvh";

export const DEFAULT_ACCESS_TOKEN =
  process.env.EXPO_PUBLIC_DEFAULT_ACCESS_TOKEN ??
  process.env.DEFAULT_ACCESS_TOKEN ??
  "";

export const API_PATHS = {
  ME: "/api/ttvh/employee/info",
  ROLL_CALL_HISTORY: "/roll-call/history",
  STATUS_CHANGE_REQUESTS: "/status-change-requests",
  SCHEDULE_EXPLANATIONS: "/schedule-explanations",
} as const;
