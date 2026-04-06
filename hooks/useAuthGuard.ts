import type { Href } from "expo-router";
import { useAuthStore } from "@/stores/useAuthStore";

const DEFAULT_SIGN_IN: Href = "/sign-in";
const DEFAULT_SIGNED_IN: Href = "/(tabs)";

export type UseAuthGuardOptions =
  | { requireAuth: true; signInHref?: Href }
  | { requireAuth: false; authedHref?: Href };

export type AuthGuardResult =
  | { isReady: false; redirectTo: null }
  | { isReady: true; redirectTo: Href | null };

/**
 * `requireAuth: true` — must be logged in (e.g. tabs).
 * `requireAuth: false` — guest only (e.g. sign-in); redirect if already logged in.
 */
export function useAuthGuard(options: UseAuthGuardOptions): AuthGuardResult {
  const isReady = useAuthStore((s) => s.isReady);
  const user = useAuthStore((s) => s.user);

  if (!isReady) {
    return { isReady: false, redirectTo: null };
  }

  if (options.requireAuth) {
    const signInHref = options.signInHref ?? DEFAULT_SIGN_IN;
    if (!user) {
      return { isReady: true, redirectTo: signInHref };
    }
    return { isReady: true, redirectTo: null };
  }

  const authedHref = options.authedHref ?? DEFAULT_SIGNED_IN;
  if (user) {
    return { isReady: true, redirectTo: authedHref };
  }
  return { isReady: true, redirectTo: null };
}
