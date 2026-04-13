import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Image, RefreshControl, ScrollView, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabsStackHeader } from "@/components/layout/TabsStackHeader";
import { AppSelect } from "@/components/ui/AppSelect";
import { AppButton } from "@/components/ui/AppButton";
import {
  filterExplainItems,
  getExplainList,
  type ExplainListItem,
  type ExplainStatusFilter,
} from "@/services/explainService";
import { Palette } from "@/utils/palette";

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** Nhãn ngắn để ô filter 3 cột không tràn; giá trị filter giữ nguyên */
const STATUS_OPTIONS: { label: string; value: ExplainStatusFilter }[] = [
  { label: "Tất cả", value: "all" },
  { label: "Chưa trình", value: "pending" },
  { label: "Đã duyệt", value: "approved" },
  { label: "Từ chối", value: "rejected" },
];

function ExplainRow({ item }: { item: ExplainListItem }) {
  return (
    <View className="flex-row gap-3 border-b border-neutral-100 py-4">
      <View className="h-14 w-14 overflow-hidden rounded-full border border-neutral-200 bg-neutral-200">
        {item.avatarUrl ? (
          <Image
            source={{ uri: item.avatarUrl }}
            className="h-full w-full"
            resizeMode="cover"
            accessibilityIgnoresInvertColors
          />
        ) : (
          <View className="h-full w-full items-center justify-center">
            <MaterialCommunityIcons
              name="account"
              size={36}
              color={Palette.textMuted}
            />
          </View>
        )}
      </View>
      <View className="min-w-0 flex-1 justify-center">
        <Text
          variant="titleSmall"
          className="font-bold text-neutral-900"
          numberOfLines={2}
        >
          {item.statusLabel}
        </Text>
        <Text variant="bodyMedium" className="mt-0.5 text-neutral-900">
          {item.userName || "—"}
        </Text>
        <Text variant="bodySmall" className="mt-0.5 text-neutral-700">
          {item.dateDisplay || "—"}
        </Text>
        <Text
          variant="bodySmall"
          className="mt-1 text-neutral-500"
          numberOfLines={3}
        >
          {item.description || "—"}
        </Text>
      </View>
    </View>
  );
}

export default function ExplainScreen() {
  const now = new Date();
  const currentYear = now.getFullYear();

  const [month, setMonth] = useState(pad2(now.getMonth() + 1));
  const [year, setYear] = useState(String(currentYear));
  const [statusFilter, setStatusFilter] =
    useState<ExplainStatusFilter>("all");

  const monthOptions = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const m = pad2(i + 1);
        return { label: m, value: m };
      }),
    [],
  );

  const yearOptions = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => {
      const y = String(currentYear - 2 + i);
      return { label: y, value: y };
    });
  }, [currentYear]);

  const { data, isPending, isError, refetch, isRefetching } = useQuery({
    queryKey: ["explain-list", month, year],
    queryFn: () => getExplainList({ month, year }),
  });

  const list = useMemo(() => {
    if (!data) return [];
    return filterExplainItems(data, statusFilter);
  }, [data, statusFilter]);

  return (
    <SafeAreaView className="flex-1 bg-neutral-100" edges={["bottom"]}>
      <TabsStackHeader title="Giải trình" />

      <View className="border-b border-neutral-200 bg-neutral-100 px-2 pb-3 pt-2">
        <View className="flex-row gap-1.5 overflow-hidden">
          <View className="min-w-0 flex-1">
            <AppSelect
              value={month}
              onChange={setMonth}
              options={monthOptions}
              placeholder="MM"
            />
          </View>
          <View className="min-w-0 flex-1">
            <AppSelect
              value={year}
              onChange={setYear}
              options={yearOptions}
              placeholder="YYYY"
            />
          </View>
          <View className="min-w-0 flex-1">
            <AppSelect
              value={statusFilter}
              onChange={(v) =>
                setStatusFilter((v || "all") as ExplainStatusFilter)
              }
              options={STATUS_OPTIONS.map((o) => ({
                label: o.label,
                value: o.value,
              }))}
              placeholder="Tất cả"
            />
          </View>
        </View>
      </View>

      <View className="min-h-0 flex-1 px-3">
        {isPending ? (
          <View className="flex-1 items-center justify-center py-12">
            <ActivityIndicator size="large" />
          </View>
        ) : isError ? (
          <View className="flex-1 items-center justify-center px-4">
            <Text className="mb-3 text-center text-neutral-700">
              Không tải được dữ liệu. Kiểm tra kết nối hoặc cấu hình API.
            </Text>
            <AppButton mode="outlined" icon="refresh" onPress={() => refetch()}>
              Thử lại
            </AppButton>
          </View>
        ) : (
          <View
            className="mt-2 flex-1 overflow-hidden rounded-t-2xl bg-white px-3"
            style={{
              shadowColor: Palette.shadow,
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.06,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <ScrollView
              className="flex-1"
              contentContainerClassName="pb-6 pt-1"
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
                <Text className="py-10 text-center text-neutral-600">
                  Chưa có bản ghi nào.
                </Text>
              ) : (
                list.map((item) => (
                  <ExplainRow key={item.id} item={item} />
                ))
              )}
            </ScrollView>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
