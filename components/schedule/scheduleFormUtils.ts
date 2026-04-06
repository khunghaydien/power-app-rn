export function toYMD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatDMY(ymd: string): string {
  const [y, m, d] = ymd.split("-");
  if (!y || !m || !d) return ymd;
  return `${d}/${m}/${y}`;
}

export function addDaysYMD(ymd: string, days: number): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  return toYMD(dt);
}

export type ScheduleFormValues = {
  fromDate: string;
  toDate: string;
  fromTime: string;
  toTime: string;
  location: string;
  method: string;
  notes: string;
};

/** Địa điểm / phương thức — thứ tự phần tử đầu là giá trị mặc định khi tạo mới */
export const SCHEDULE_LOCATION_OPTIONS = [
  "Tại cơ quan",
  "Tại nhà",
  "Khác",
] as const;

export const SCHEDULE_METHOD_OPTIONS = [
  "Trực tiếp",
  "Trực tuyến",
  "Kết hợp",
] as const;

/** Dữ liệu demo khi sửa — thay bằng API GET theo ngày khi có backend */
export function getDemoScheduleForEdit(
  dateYmd: string,
  minDateStr: string,
): ScheduleFormValues {
  const from = dateYmd >= minDateStr ? dateYmd : minDateStr;
  return {
    fromDate: from,
    toDate: addDaysYMD(from, 7),
    fromTime: "08:00",
    toTime: "09:30",
    location: SCHEDULE_LOCATION_OPTIONS[0],
    method: SCHEDULE_METHOD_OPTIONS[0],
    notes: "Đăng ký theo quy định. Có thể chỉnh sửa trước khi lưu.",
  };
}

export function buildEmptyCreateValues(
  seedDate: string | undefined,
  minDateStr: string,
): ScheduleFormValues {
  const from =
    seedDate && seedDate >= minDateStr ? seedDate : minDateStr;
  return {
    fromDate: from,
    toDate: "",
    fromTime: "",
    toTime: "",
    location: SCHEDULE_LOCATION_OPTIONS[0],
    method: SCHEDULE_METHOD_OPTIONS[0],
    notes: "",
  };
}
