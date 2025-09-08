"use client";

import { SWRConfig } from "swr";
import { ReactNode } from "react";
import { fetcher } from "@/lib/fetcher";

interface SWRProviderProps {
  children: ReactNode;
}

export function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        refreshInterval: 0,
        errorRetryCount: 3,
        errorRetryInterval: 5000,
        onError: (error) => {
          console.error("SWR Error:", error);
        },
        // Cache provider for better performance
        provider: () => new Map(),
        // Dedupe requests within 2 seconds
        dedupingInterval: 2000,
      }}
    >
      {children}
    </SWRConfig>
  );
}

