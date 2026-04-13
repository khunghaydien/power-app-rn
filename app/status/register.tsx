import { router } from "expo-router";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabsStackHeader } from "@/components/layout/TabsStackHeader";
import { AppButton } from "@/components/ui/AppButton";

export default function StatusRegisterScreen() {
  return (
    <SafeAreaView className="flex-1 bg-neutral-100" edges={["bottom"]}>
      <TabsStackHeader title="Đăng ký thay đổi tình trạng" />
      <View className="flex-1 items-center justify-center px-6">
        <Text variant="bodyMedium" className="mb-6 text-center text-neutral-600">
          Màn hình gửi đăng ký sẽ được bổ sung (form + gọi API).
        </Text>
        <AppButton mode="outlined" onPress={() => router.back()}>
          Quay lại
        </AppButton>
      </View>
    </SafeAreaView>
  );
}
