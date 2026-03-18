import { createClientStore } from "@/lib/state";

interface BannedState {
  isBanned: boolean;
  setBanned: (value: boolean) => void;
}

export const useBannedStore = createClientStore<BannedState>(
  (set) => ({
    isBanned: false,
    setBanned: (isBanned) => set({ isBanned }),
  }),
  { name: "banned-store" }
);
