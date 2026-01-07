/**
 * Client State Utilities
 * 
 * Helper functions and patterns for managing client state with Zustand
 */

import { createStore } from "@/lib/zustand";

/**
 * Create a client state store with standard configuration
 * 
 * @example
 * ```ts
 * interface MyStore {
 *   value: string;
 *   setValue: (value: string) => void;
 * }
 * 
 * export const useMyStore = createClientStore<MyStore>(
 *   (set) => ({
 *     value: "",
 *     setValue: (value) => set({ value }),
 *   }),
 *   { name: "my-store", persist: true }
 * );
 * ```
 */
export function createClientStore<T extends object>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  storeCreator: (set: any, get: any) => T,
  options?: {
    name?: string;
    persist?: boolean;
    devtools?: boolean;
  }
) {
  return createStore<T>(storeCreator, {
    devtools: process.env.NODE_ENV === "development",
    ...options,
  });
}


