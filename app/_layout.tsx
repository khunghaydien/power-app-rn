import "../global.css";
import { Stack } from "expo-router";
import * as SystemUI from "expo-system-ui";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Appearance } from "react-native";
import { MD3LightTheme, PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppProvider } from "@/providers/AppProvider";
import { useAuthBootstrap } from "@/hooks/useAuthBootstrap";
import { Palette } from "@/utils/palette";

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

export default function RootLayout() {
  useAuthBootstrap();

  useEffect(() => {
    Appearance.setColorScheme("light");
    void SystemUI.setBackgroundColorAsync(Palette.white);
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AppProvider>
        <PaperProvider theme={paperTheme}>
          <Stack screenOptions={{ headerShown: false }} />
        </PaperProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}
