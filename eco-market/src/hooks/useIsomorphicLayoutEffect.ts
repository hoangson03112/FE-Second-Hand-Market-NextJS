"use client";

import { useEffect, useLayoutEffect } from 'react';

// Use useLayoutEffect on client side, useEffect on server side
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;



