import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { authService } from "@/services/authService";
import { clearTokens, getAccessToken } from "@/services/tokenService";
import { useAuthStore } from "@/stores/useAuthStore";

void SplashScreen.preventAutoHideAsync();

/** Call once from root layout: load token, validate with `getMe`, hide splash */
export function useAuthBootstrap() {
  const setReady = useAuthStore((s) => s.setReady);
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        const access = await getAccessToken();
        if (access) {
          try {
            const user = await authService.getMe();
            if (!cancelled) setUser(user);
          } catch {
            await clearTokens();
            if (!cancelled) setUser(null);
          }
        }
      } finally {
        if (!cancelled) {
          setReady(true);
          await SplashScreen.hideAsync();
        }
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [setReady, setUser]);
}
