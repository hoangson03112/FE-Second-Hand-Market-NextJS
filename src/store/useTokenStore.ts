import { createClientStore } from "@/lib/state";

const LOCAL_TOKEN_KEY = "eco-access-token";
const SESSION_TOKEN_KEY = "eco-access-token-session";
const LEGACY_PERSIST_KEY = "token-store";

type SetAccessTokenOptions = {
  remember?: boolean;
};

interface TokenState {
  accessToken: string | null;
  setAccessToken: (token: string | null, options?: SetAccessTokenOptions) => void;
  hydrateAccessToken: () => void;
  clearAuth: () => void;
}

export const useTokenStore = createClientStore<TokenState>(
  (set, get) => ({
    accessToken: null,
    setAccessToken: (accessToken, options) => {
      if (typeof window !== "undefined") {
        if (!accessToken) {
          window.localStorage.removeItem(LOCAL_TOKEN_KEY);
          window.sessionStorage.removeItem(SESSION_TOKEN_KEY);
        } else {
          const existingMode = window.localStorage.getItem(LOCAL_TOKEN_KEY)
            ? "local"
            : window.sessionStorage.getItem(SESSION_TOKEN_KEY)
              ? "session"
              : null;
          const targetMode =
            options?.remember === true
              ? "local"
              : options?.remember === false
                ? "session"
                : existingMode || "local";

          if (targetMode === "local") {
            window.localStorage.setItem(LOCAL_TOKEN_KEY, accessToken);
            window.sessionStorage.removeItem(SESSION_TOKEN_KEY);
          } else {
            window.sessionStorage.setItem(SESSION_TOKEN_KEY, accessToken);
            window.localStorage.removeItem(LOCAL_TOKEN_KEY);
          }
        }
      }

      set({ accessToken });
    },
    hydrateAccessToken: () => {
      if (typeof window === "undefined") return;

      const current = get().accessToken;
      if (current) return;

      let localToken = window.localStorage.getItem(LOCAL_TOKEN_KEY);
      const sessionToken = window.sessionStorage.getItem(SESSION_TOKEN_KEY);
      if (!localToken) {
        const legacyRaw = window.localStorage.getItem(LEGACY_PERSIST_KEY);
        if (legacyRaw) {
          try {
            const legacyData = JSON.parse(legacyRaw) as {
              state?: { accessToken?: string | null };
            };
            const legacyToken = legacyData?.state?.accessToken;
            if (legacyToken) {
              window.localStorage.setItem(LOCAL_TOKEN_KEY, legacyToken);
              localToken = legacyToken;
            }
          } catch {
            // Ignore malformed legacy value.
          } finally {
            window.localStorage.removeItem(LEGACY_PERSIST_KEY);
          }
        }
      }

      const token = localToken || sessionToken;

      if (token) {
        set({ accessToken: token });
      }
    },
    clearAuth: () => {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(LOCAL_TOKEN_KEY);
        window.sessionStorage.removeItem(SESSION_TOKEN_KEY);
      }
      set({ accessToken: null });
    },
  }),
  {
    name: "token-store-runtime",
    persist: false,
  }
);
