import { createClientStore } from "@/lib/state";

interface TokenState {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  clearAuth: () => void;
}

export const useTokenStore = createClientStore<TokenState>(
  (set) => ({
    accessToken: null,
    setAccessToken: (accessToken) => set({ accessToken }),
    clearAuth: () => set({ accessToken: null }),
  }),
  {
    name: "token-store",
    persist: true,
  }
);
