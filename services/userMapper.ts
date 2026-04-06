export type User = {
  id: string;
  email: string;
  name?: string;
  /** Mã nhân viên — map từ API `/users/me` nếu có */
  employeeCode?: string;
  /** Giới tính (hiển thị text, ví dụ Nam / Nữ) */
  gender?: string;
  /** Vùng / khu vực */
  region?: string;
  /** Đơn vị công tác */
  unit?: string;
  /** Ngày bắt đầu tập luyện — ISO `YYYY-MM-DD` hoặc chuỗi hiển thị từ API */
  trainingStartDate?: string;
  /** Ảnh đại diện (URL) */
  avatarUrl?: string;
};

/** Shape returned by Railway API (may include secrets — strip before store) */
export type ApiUserPayload = {
  id: string;
  email: string;
  name?: string;
  employeeCode?: string;
  maNv?: string;
  ma_nv?: string;
  employee_code?: string;
  staffCode?: string;
  gender?: string;
  gioiTinh?: string;
  sex?: string;
  region?: string;
  vung?: string;
  area?: string;
  unit?: string;
  donVi?: string;
  don_vi?: string;
  department?: string;
  departmentName?: string;
  trainingStartDate?: string;
  ngayBatDauTapLuyen?: string;
  training_start_date?: string;
  avatarUrl?: string;
  avatar?: string;
  photoUrl?: string;
  passwordHash?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  lastLogin?: string | null;
};

function pickEmployeeCode(raw: ApiUserPayload): string | undefined {
  const extra = raw as ApiUserPayload & Record<string, unknown>;
  const candidates = [
    raw.employeeCode,
    raw.maNv,
    raw.ma_nv,
    raw.employee_code,
    raw.staffCode,
    typeof extra.code === "string" ? extra.code : undefined,
  ];
  const v = candidates.find((x) => typeof x === "string" && x.length > 0);
  return v;
}

function pickFirstString(
  ...candidates: (string | undefined)[]
): string | undefined {
  const v = candidates.find((x) => typeof x === "string" && x.trim().length > 0);
  return v?.trim();
}

export function toUser(raw: ApiUserPayload): User {
  const extra = raw as ApiUserPayload & Record<string, unknown>;
  return {
    id: raw.id,
    email: raw.email,
    name: raw.name,
    employeeCode: pickEmployeeCode(raw),
    gender: pickFirstString(raw.gender, raw.gioiTinh, raw.sex),
    region: pickFirstString(raw.region, raw.vung, raw.area),
    unit: pickFirstString(
      raw.unit,
      raw.donVi,
      raw.don_vi,
      raw.department,
      raw.departmentName,
    ),
    trainingStartDate: pickFirstString(
      raw.trainingStartDate,
      raw.ngayBatDauTapLuyen,
      raw.training_start_date,
    ),
    avatarUrl: pickFirstString(
      raw.avatarUrl,
      raw.avatar,
      raw.photoUrl,
      typeof extra.photo === "string" ? extra.photo : undefined,
    ),
  };
}
