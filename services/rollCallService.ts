import { apiClient } from "./apiClient";
import { API_PATHS } from "@/utils/constants";

export type RollCallHistoryItem = {
  id: string;
  employeeCode: string;
  workoutDate: string;
  checkInTime?: string;
  checkOutTime?: string;
  withPt?: boolean;
  ptSigned?: boolean;
  location?: string;
  imageUrl?: string;
};

type UnknownRecord = Record<string, unknown>;

function toStr(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined;
}

function toBool(v: unknown): boolean | undefined {
  return typeof v === "boolean" ? v : undefined;
}

function pickArray(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const r = data as UnknownRecord;
    if (Array.isArray(r.data)) return r.data;
    if (Array.isArray(r.items)) return r.items;
    if (Array.isArray(r.records)) return r.records;
  }
  return [];
}

function normalizeRow(raw: unknown, idx: number): RollCallHistoryItem {
  const r = (raw ?? {}) as UnknownRecord;
  const id =
    toStr(r.id) ?? toStr(r._id) ?? toStr(r.uuid) ?? `${Date.now()}-${idx}`;

  const employeeCode =
    toStr(r.employeeCode) ??
    toStr(r.staffCode) ??
    toStr(r.maNv) ??
    toStr(r.ma_nv) ??
    "--";

  const workoutDate =
    toStr(r.workoutDate) ??
    toStr(r.date) ??
    toStr(r.trainingDate) ??
    toStr(r.ngayTap) ??
    "";

  return {
    id,
    employeeCode,
    workoutDate,
    checkInTime: toStr(r.checkInTime) ?? toStr(r.checkIn) ?? toStr(r.gioVao),
    checkOutTime: toStr(r.checkOutTime) ?? toStr(r.checkOut) ?? toStr(r.gioRa),
    withPt: toBool(r.withPt) ?? toBool(r.tapCungPt),
    ptSigned: toBool(r.ptSigned) ?? toBool(r.ptConfirmed),
    location:
      toStr(r.location) ?? toStr(r.locationName) ?? toStr(r.diaDiemTap),
    imageUrl: toStr(r.imageUrl) ?? toStr(r.photoUrl) ?? toStr(r.image),
  };
}

export async function getRollCallHistory(params: {
  month: string;
  year: string;
}): Promise<RollCallHistoryItem[]> {
  const endpoints = [
    API_PATHS.ROLL_CALL_HISTORY,
    "/attendance/history-roll-call",
    "/history-roll-call",
  ];

  let lastError: unknown = null;
  for (const endpoint of endpoints) {
    try {
      const res = await apiClient.get(endpoint, {
        params: { month: params.month, year: params.year },
      });
      const arr = pickArray(res.data);
      return arr.map(normalizeRow);
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError ?? new Error("Không lấy được lịch sử điểm danh");
}
