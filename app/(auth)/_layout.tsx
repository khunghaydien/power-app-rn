import { Redirect, Slot } from "expo-router";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function AuthLayout() {
  const guard = useAuthGuard({ requireAuth: false });

  if (!guard.isReady) {
    return null;
  }

  if (guard.redirectTo) {
    return <Redirect href={guard.redirectTo} />;
  }

  return <Slot />;
}
