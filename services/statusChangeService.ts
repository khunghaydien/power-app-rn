import { apiClient } from "./apiClient";
import { API_PATHS } from "@/utils/constants";

export type StatusChangeRequestItem = {
  id: string;
  /** Chuẩn hóa nội bộ để lọc */
  statusKey: "pending" | "approved" | "rejected" | "unknown";
  /** Nhãn hiển thị (Đã duyệt, Chờ duyệt, …) */
  statusLabel: string;
  employeeName: string;
  employeeCode: string;
  checkDescription: string;
  createdAtDisplay: string;
  approvedAtDisplay: string;
  trainingDescription: string;
};

type UnknownRecord = Record<string, unknown>;

function toStr(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined;
}

function pickArray(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const r = data as UnknownRecord;
    if (Array.isArray(r.data)) return r.data;
    if (Array.isArray(r.items)) return r.items;
    if (Array.isArray(r.records)) return r.records;
    if (Array.isArray(r.results)) return r.results;
  }
  return [];
}

function parseStatus(raw: UnknownRecord): {
  key: StatusChangeRequestItem["statusKey"];
  label: string;
} {
  const s =
    toStr(raw.status) ??
    toStr(raw.state) ??
    toStr(raw.trangThai) ??
    toStr(raw.approvalStatus) ??
    "";

  const lower = s.toLowerCase();
  if (
    lower.includes("duyệt") ||
    lower.includes("approved") ||
    lower === "đã duyệt"
  ) {
    return { key: "approved", label: s || "Đã duyệt" };
  }
  if (
    lower.includes("chờ") ||
    lower.includes("pending") ||
    lower.includes("draft")
  ) {
    return { key: "pending", label: s || "Chờ duyệt" };
  }
  if (
    lower.includes("từ chối") ||
    lower.includes("reject") ||
    lower.includes("declined")
  ) {
    return { key: "rejected", label: s || "Từ chối" };
  }
  return { key: "unknown", label: s || "—" };
}

function formatDateTimeVi(raw?: string): string {
  if (!raw?.trim()) return "";
  const d = new Date(raw);
  if (!Number.isNaN(d.getTime())) {
    return d.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }
  return raw.trim();
}

function normalizeRow(raw: unknown, idx: number): StatusChangeRequestItem {
  const r = (raw ?? {}) as UnknownRecord;
  const id =
    toStr(r.id) ?? toStr(r._id) ?? toStr(r.uuid) ?? `row-${idx}`;

  const { key, label } = parseStatus(r);

  const employeeName =
    toStr(r.employeeName) ??
    toStr(r.fullName) ??
    toStr(r.name) ??
    toStr(r.hoTen) ??
    "";

  const employeeCode =
    toStr(r.employeeCode) ??
    toStr(r.staffCode) ??
    toStr(r.maNv) ??
    toStr(r.ma_nv) ??
    "";

  const checkDescription =
    toStr(r.checkDescription) ??
    toStr(r.checkType) ??
    toStr(r.kiemTra) ??
    toStr(r.examinationType) ??
    "";

  const createdRaw =
    toStr(r.createdAt) ??
    toStr(r.created_at) ??
    toStr(r.ngayTao) ??
    "";

  const approvedRaw =
    toStr(r.approvedAt) ??
    toStr(r.approved_at) ??
    toStr(r.ngayDuyet) ??
    toStr(r.reviewedAt) ??
    "";

  const trainingDescription =
    toStr(r.trainingDescription) ??
    toStr(r.trainingStatus) ??
    toStr(r.tapLuyen) ??
    toStr(r.trainingNote) ??
    "";

  return {
    id,
    statusKey: key,
    statusLabel: label,
    employeeName,
    employeeCode,
    checkDescription,
    createdAtDisplay: formatDateTimeVi(createdRaw) || createdRaw,
    approvedAtDisplay: formatDateTimeVi(approvedRaw) || approvedRaw,
    trainingDescription,
  };
}

export type StatusChangeFilter = "all" | "pending" | "approved" | "rejected";

export async function getStatusChangeRequests(_params?: {
  filter?: StatusChangeFilter;
}): Promise<StatusChangeRequestItem[]> {
  const endpoints = [
    API_PATHS.STATUS_CHANGE_REQUESTS,
    "/staff/status-changes",
    "/health-status/changes",
  ];

  let lastError: unknown = null;
  for (const endpoint of endpoints) {
    try {
      const res = await apiClient.get(endpoint);
      const arr = pickArray(res.data);
      return arr.map(normalizeRow);
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError ?? new Error("Không tải được danh sách thay đổi tình trạng");
}

export function filterItems(
  items: StatusChangeRequestItem[],
  filter: StatusChangeFilter,
): StatusChangeRequestItem[] {
  if (filter === "all") return items;
  return items.filter((it) => {
    if (filter === "pending") return it.statusKey === "pending";
    if (filter === "approved") return it.statusKey === "approved";
    if (filter === "rejected") return it.statusKey === "rejected";
    return true;
  });
}
