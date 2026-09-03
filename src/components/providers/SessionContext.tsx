"use client";

import { createContext, useContext } from "react";


export const SessionContext = createContext(false);

export function useHasSession() {
  return useContext(SessionContext);
}
