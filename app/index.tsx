import { Redirect } from "expo-router";
import { useAuthStore } from "@/stores/useAuthStore";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const isReady = useAuthStore((s) => s.isReady);
  const user = useAuthStore((s) => s.user);

  if (!isReady) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/sign-in" />;
}
