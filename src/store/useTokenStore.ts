/**
 * Token Store (Client State)
 * 
 * Manages authentication token using Zustand
 * This is CLIENT STATE because it's auth token, not server data
 * 
 * Note: User account information should be fetched using useUser() hook (server state)
 */
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
    persist: true, // Persist accessToken to localStorage
  }
);





