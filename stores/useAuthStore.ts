import { create } from "zustand";
import type { User } from "@/services/authService";

type AuthState = {
    isReady: boolean;
    user: User | null;
    setReady: (ready: boolean) => void;
    setUser: (user: User | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    isReady: false,
    user: null,
    setReady: (isReady) => set({ isReady }),
    setUser: (user) => set({ user }),
}));
