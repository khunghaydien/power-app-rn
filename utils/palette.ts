/**
 * Palette UI: chỉ trắng / đen / xám (không dùng màu accent khác).
 * Dùng chung để đồng bộ theme và calendar.
 */
export const Palette = {
  white: "#ffffff",
  black: "#0a0a0a",
  /** Ngày chọn, nút chính */
  selectedBg: "#171717",
  selectedText: "#ffffff",
  /** Chữ chính */
  text: "#171717",
  /** Chữ phụ */
  textMuted: "#737373",
  /** Viền ô */
  border: "#e5e5e5",
  borderStrong: "#d4d4d4",
  /** Nền input / surface nhạt */
  surface: "#f5f5f5",
  surfaceSubtle: "#fafafa",
  /** Hôm nay / icon phụ */
  accentGray: "#525252",
  /** Ngày disabled / mờ */
  disabled: "#a3a3a3",
  /** Shadow */
  shadow: "#0a0a0a",
} as const;
