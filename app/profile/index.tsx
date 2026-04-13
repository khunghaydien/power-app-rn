import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, ScrollView, View } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabsStackHeader } from "@/components/layout/TabsStackHeader";
import { useAuthStore } from "@/stores/useAuthStore";
import { Palette } from "@/utils/palette";
import { formatDMY } from "@/components/schedule/scheduleFormUtils";

function displayTrainingDate(raw?: string | null): string {
  if (!raw?.trim()) return "";
  const s = raw.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    return formatDMY(s);
  }
  return s;
}

function Field({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View>
      <Text variant="labelLarge" className="mb-1 font-bold text-neutral-900">
        {label}
      </Text>
      <TextInput
        mode="outlined"
        value={value}
        editable={false}
        dense
        style={{ backgroundColor: Palette.surface }}
      />
    </View>
  );
}

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);

  const employeeCode = user?.employeeCode?.trim() ?? "";
  const name = user?.employeeFullname?.trim() ?? "";
  const gender = user?.gender?.trim() ?? "";
  const region = user?.region?.trim() ?? "";
  const unit = user?.department?.trim() ?? "";
  const training = displayTrainingDate(user?.trainingStartDate);
  const avatarUrl = user?.avatarUrl?.trim();

  return (
    <SafeAreaView className="flex-1 bg-neutral-100" edges={["bottom"]}>
      <TabsStackHeader title="Thông tin cán bộ" />
      <ScrollView
        className="flex-1 bg-neutral-100"
        contentContainerClassName="px-4 pb-10 pt-6"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center">
          <View
            className="h-[120px] w-[120px] overflow-hidden rounded-full border border-neutral-200 bg-neutral-200"
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            {avatarUrl ? (
              <Image
                source={{ uri: avatarUrl }}
                className="h-full w-full"
                resizeMode="cover"
                accessibilityIgnoresInvertColors
              />
            ) : (
              <MaterialCommunityIcons
                name="account"
                size={72}
                color={Palette.textMuted}
              />
            )}
          </View>
        </View>

        <View className="mt-8 gap-4">
          <Field label="Mã NV" value={employeeCode} />
          <Field label="Họ tên" value={name} />
          <Field label="Giới tính" value={gender} />
          <Field label="Vùng" value={region} />
          <Field label="Đơn vị" value={unit} />
          <Field label="Ngày bắt đầu tập luyện" value={training} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
