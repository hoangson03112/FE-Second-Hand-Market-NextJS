import type { AccountInfo } from "@/types/auth";
import { createStore } from "@/lib/zustand";

interface UserState {
  account: AccountInfo | null;
  accessToken: string | null;
  isLoading: boolean;
  setAccount: (account: AccountInfo | null) => void;
  setAccessToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  clearAccount: () => void;
  clearAuth: () => void;
}

export const useUserStore = createStore<UserState>(
  (set) => ({
    account: null,
    accessToken: null,
    isLoading: false,
    setAccount: (account) => set({ account }),
    setAccessToken: (accessToken) => set({ accessToken }),
    setLoading: (isLoading) => set({ isLoading }),
    clearAccount: () => set({ account: null }),
    clearAuth: () => set({ account: null, accessToken: null }),
  }),
  {
    name: "user-store",
    persist: true, // Persist user data and accessToken
    devtools: true,
  }
);
