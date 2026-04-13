import "../global.css";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Tabs } from "expo-router";
import * as SystemUI from "expo-system-ui";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Appearance, View } from "react-native";
import { MD3LightTheme, PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppProvider } from "@/providers/AppProvider";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/stores/useAuthStore";
import { Palette } from "@/utils/palette";

type MciName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

function TabBarIcon({
  name,
  color,
  size,
}: {
  name: MciName;
  color: string;
  size: number;
}) {
  return <MaterialCommunityIcons name={name} size={size} color={color} />;
}
const paperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: Palette.selectedBg,
    onPrimary: Palette.selectedText,
    primaryContainer: Palette.border,
    onPrimaryContainer: Palette.text,
    secondary: Palette.accentGray,
    onSecondary: Palette.white,
    secondaryContainer: Palette.surface,
    onSecondaryContainer: Palette.text,
    tertiary: Palette.textMuted,
    surface: Palette.white,
    surfaceVariant: Palette.surface,
    onSurface: Palette.text,
    onSurfaceVariant: Palette.textMuted,
    outline: Palette.borderStrong,
    outlineVariant: Palette.border,
    error: Palette.text,
    onError: Palette.white,
    errorContainer: Palette.surface,
    onErrorContainer: Palette.text,
  },
};

function AuthMeSync() {
  const setUser = useAuthStore((s) => s.setUser);
  const { data, isError } = useQuery({
    queryKey: ["me"],
    queryFn: () => authService.getMe(),
    retry: 0,
  });

  useEffect(() => {
    if (data) {
      setUser(data);
      console.log(data);
      return;
    }
    if (isError) {
      setUser(null);
    }
  }, [data, isError, setUser]);

  return null;
}

export default function RootLayout() {
  useEffect(() => {
    Appearance.setColorScheme("light");
    void SystemUI.setBackgroundColorAsync(Palette.white);
  }, []);
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AppProvider>
        <AuthMeSync />
        <PaperProvider theme={paperTheme}>
          <View className="flex-1 bg-neutral-100">
            <View className="min-h-0 flex-1">
              <Tabs
                screenOptions={{
                  headerShown: false,
                  tabBarActiveTintColor: Palette.text,
                  tabBarInactiveTintColor: Palette.textMuted,
                }}
              >
                <Tabs.Screen
                  name="index"
                  options={{
                    title: "Trang chủ",
                    tabBarIcon: ({ color, size }) => (
                      <TabBarIcon name="home-outline" color={color} size={size} />
                    ),
                  }}
                />
                <Tabs.Screen
                  name="schedule"
                  options={{
                    href: null,
                  }}
                />
                <Tabs.Screen
                  name="roll-call"
                  options={{
                    href: null,
                  }}
                />
                <Tabs.Screen
                  name="history-roll-call"
                  options={{
                    href: null,
                  }}
                />
                <Tabs.Screen
                  name="profile"
                  options={{
                    href: null,
                  }}
                />
                <Tabs.Screen
                  name="status"
                  options={{
                    href: null,
                  }}
                />
                <Tabs.Screen
                  name="explain"
                  options={{
                    href: null,
                  }}
                />
              </Tabs>
            </View>
          </View>
        </PaperProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}
