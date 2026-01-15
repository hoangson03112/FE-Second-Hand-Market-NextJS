"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { createQueryClient } from "@/lib/query-client";
// import { Analytics } from '@vercel/analytics/react';

export default function Providers({ children }: { children: React.ReactNode }) {
  // Khởi tạo QueryClient với centralized configuration
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      
      {children}
      {/* <Analytics /> */}
    </QueryClientProvider>
  );
}
