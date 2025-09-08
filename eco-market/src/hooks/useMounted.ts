"use client";

import { useEffect, useState } from 'react';

/**
 * Hook to check if component is mounted on client side
 * Useful for preventing hydration mismatches
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

export default useMounted;



