import { apiClient } from "./apiClient";
import { API_PATHS } from "@/utils/constants";

export type ExplainListItem = {
  id: string;
  statusKey: "pending" | "approved" | "rejected" | "unknown";
  statusLabel: string;
  userName: string;
  dateDisplay: string;
  description: string;
  avatarUrl?: string;
};

export type ExplainStatusFilter = "all" | "pending" | "approved" | "rejected";

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
  key: ExplainListItem["statusKey"];
  label: string;
} {
  const s =
    toStr(raw.status) ??
    toStr(raw.state) ??
    toStr(raw.trangThai) ??
    toStr(raw.explainStatus) ??
    "";

  const lower = s.toLowerCase();
  if (
    lower.includes("chưa") ||
    lower.includes("pending") ||
    lower.includes("chua giai trinh")
  ) {
    return { key: "pending", label: s || "Chưa giải trình" };
  }
  if (
    lower.includes("duyệt") ||
    lower.includes("approved") ||
    lower.includes("đã duyệt")
  ) {
    return { key: "approved", label: s || "Đã duyệt" };
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

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function formatDateVi(raw?: string): string {
  if (!raw?.trim()) return "";
  const s = raw.trim();
  if (s.includes("T")) {
    const d = new Date(s);
    if (!Number.isNaN(d.getTime())) {
      return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
    }
  }
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) {
    return `${m[3]}/${m[2]}/${m[1]}`;
  }
  return s;
}

function normalizeRow(raw: unknown, idx: number): ExplainListItem {
  const r = (raw ?? {}) as UnknownRecord;
  const id =
    toStr(r.id) ?? toStr(r._id) ?? toStr(r.uuid) ?? `explain-${idx}`;

  const { key, label } = parseStatus(r);

  const userName =
    toStr(r.userName) ??
    toStr(r.fullName) ??
    toStr(r.name) ??
    toStr(r.hoTen) ??
    toStr(r.employeeName) ??
    "";

  const dateRaw =
    toStr(r.date) ??
    toStr(r.workoutDate) ??
    toStr(r.recordDate) ??
    toStr(r.ngay) ??
    toStr(r.createdAt) ??
    "";

  const description =
    toStr(r.description) ??
    toStr(r.reason) ??
    toStr(r.lyDo) ??
    toStr(r.detail) ??
    toStr(r.note) ??
    "";

  const avatarUrl =
    toStr(r.avatarUrl) ?? toStr(r.avatar) ?? toStr(r.photoUrl);

  return {
    id,
    statusKey: key,
    statusLabel: label,
    userName,
    dateDisplay: formatDateVi(dateRaw) || dateRaw,
    description,
    avatarUrl,
  };
}

export async function getExplainList(params: {
  month: string;
  year: string;
}): Promise<ExplainListItem[]> {
  const endpoints = [
    API_PATHS.SCHEDULE_EXPLANATIONS,
    "/explain/list",
    "/training-explanations",
  ];

  const query = {
    month: params.month,
    year: params.year,
  };

  let lastError: unknown = null;
  for (const endpoint of endpoints) {
    try {
      const res = await apiClient.get(endpoint, { params: query });
      const arr = pickArray(res.data);
      return arr.map(normalizeRow);
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError ?? new Error("Không tải được danh sách giải trình");
}

export function filterExplainItems(
  items: ExplainListItem[],
  filter: ExplainStatusFilter,
): ExplainListItem[] {
  if (filter === "all") return items;
  return items.filter((it) => {
    if (filter === "pending") return it.statusKey === "pending";
    if (filter === "approved") return it.statusKey === "approved";
    if (filter === "rejected") return it.statusKey === "rejected";
    return true;
  });
}
