import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { TabsStackHeader } from "@/components/layout/TabsStackHeader";
import { AppSelect } from "@/components/ui/AppSelect";
import { AppButton } from "@/components/ui/AppButton";
import {
  filterItems,
  getStatusChangeRequests,
  type StatusChangeFilter,
  type StatusChangeRequestItem,
} from "@/services/statusChangeService";
import { Palette } from "@/utils/palette";

const FILTER_OPTIONS: { label: string; value: StatusChangeFilter }[] = [
  { label: "Tất cả", value: "all" },
  { label: "Chờ duyệt", value: "pending" },
  { label: "Đã duyệt", value: "approved" },
  { label: "Từ chối", value: "rejected" },
];

function Row({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  const display = value.trim() ? value : "";
  return (
    <View className="mb-2 flex-row items-start gap-2">
      <Text variant="bodyMedium" className="w-[38%] text-neutral-600">
        {label}
      </Text>
      <Text
        variant="bodyMedium"
        className="min-w-0 flex-1 text-right font-medium text-neutral-900"
      >
        {display || "—"}
      </Text>
    </View>
  );
}

function StatusCard({ item }: { item: StatusChangeRequestItem }) {
  return (
    <View
      className="mb-3 overflow-hidden rounded-xl border border-neutral-200 bg-white px-4 py-4"
      style={{
        shadowColor: Palette.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <Text
        variant="titleSmall"
        className="mb-3 font-semibold"
        style={{ color: Palette.accentGray }}
      >
        {item.statusLabel}
      </Text>
      <Row label="Tên:" value={item.employeeName} />
      <Row label="Mã nhân viên:" value={item.employeeCode} />
      <Row label="Kiểm tra:" value={item.checkDescription} />
      <Row label="Ngày tạo:" value={item.createdAtDisplay} />
      <Row label="Ngày duyệt:" value={item.approvedAtDisplay} />
      <Row label="Tập luyện:" value={item.trainingDescription} />
    </View>
  );
}

export default function StatusScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<StatusChangeFilter>("all");

  const { data, isPending, isError, refetch, isRefetching } = useQuery({
    queryKey: ["status-change-requests"],
    queryFn: () => getStatusChangeRequests({ filter }),
  });

  const list = useMemo(() => {
    if (!data) return [];
    return filterItems(data, filter);
  }, [data, filter]);

  return (
    <SafeAreaView className="flex-1 bg-neutral-100" edges={["top"]}>
      <TabsStackHeader title="Quản lý thay đổi tình trạng" />

      <View className="min-h-0 flex-1">
        <View className="border-b border-neutral-200 bg-neutral-100 px-4 pb-3 pt-2">
          <AppSelect
            value={filter}
            onChange={(v) => setFilter((v || "all") as StatusChangeFilter)}
            options={FILTER_OPTIONS.map((o) => ({
              label: o.label,
              value: o.value,
            }))}
            placeholder="Tất cả"
          />
        </View>

        {isPending ? (
          <View className="flex-1 items-center justify-center py-12">
            <ActivityIndicator size="large" />
          </View>
        ) : isError ? (
          <View className="flex-1 items-center justify-center px-6">
            <Text className="mb-3 text-center text-neutral-700">
              Không tải được dữ liệu. Kiểm tra kết nối hoặc cấu hình API.
            </Text>
            <AppButton mode="outlined" icon="refresh" onPress={() => refetch()}>
              Thử lại
            </AppButton>
          </View>
        ) : (
          <ScrollView
            className="flex-1"
            contentContainerClassName="px-4 pb-4 pt-3"
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={() => refetch()}
              />
            }
          >
            {list.length === 0 ? (
              <Text className="py-8 text-center text-neutral-600">
                Chưa có bản ghi nào.
              </Text>
            ) : (
              list.map((item) => (
                <StatusCard key={item.id} item={item} />
              ))
            )}
          </ScrollView>
        )}
      </View>

      <View
        className="border-t border-neutral-200 bg-white px-4 pt-3"
        style={{ paddingBottom: Math.max(insets.bottom, 12) }}
      >
        <AppButton
          mode="contained"
          icon="plus"
          onPress={() => router.push("/status/register")}
        >
          Đăng ký thay đổi tình trạng
        </AppButton>
      </View>
    </SafeAreaView>
  );
}
