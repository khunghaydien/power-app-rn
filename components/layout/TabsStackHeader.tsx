import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, View } from "react-native";
import { Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Palette } from "@/utils/palette";

export type TabsStackHeaderProps = {
  title: string;
  onBackPress?: () => void;
  showBack?: boolean;
};

export function TabsStackHeader({
  title,
  onBackPress,
  showBack = true,
}: TabsStackHeaderProps) {
  const insets = useSafeAreaInsets();
  const goBack = onBackPress ?? (() => router.back());

  return (
    <View
      className="border-b border-neutral-200 bg-white"
      style={{ paddingTop: insets.top }}
    >
      <View className="min-h-[52px] flex-row items-center px-2 pb-2 pt-1">
        <View className="w-11 justify-center">
          {showBack ? (
            <Pressable
              onPress={goBack}
              className="rounded-full p-2 active:opacity-60"
              accessibilityRole="button"
              accessibilityLabel="Quay lại"
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color={Palette.text}
              />
            </Pressable>
          ) : null}
        </View>
        <View className="min-w-0 flex-1 items-center px-1">
          <Text
            variant="titleLarge"
            className="font-bold text-neutral-900"
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tài khoản"
          className="rounded-full p-1 active:opacity-70"
        >
          <MaterialCommunityIcons
            name="account-circle-outline"
            size={40}
            color={Palette.textMuted}
          />
        </Pressable>
      </View>
    </View>
  );
}
