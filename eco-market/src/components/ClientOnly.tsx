"use client";

import { ReactNode } from 'react';
import useMounted from '@/hooks/useMounted';

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Wrapper component that only renders children on client side
 * Prevents hydration mismatches for client-only content
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const mounted = useMounted();
  
  if (!mounted) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}
export default ClientOnly;


