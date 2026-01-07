/**
 * State Management Exports
 * 
 * Centralized exports for state management utilities
 * 
 * Usage:
 *   - Client State: import { createClientStore } from '@/lib/state'
 *   - Server State: import { serverStateConfig } from '@/lib/state'
 *     Then use with useQuery from @tanstack/react-query
 */

// Server State Config (TanStack Query)
export { serverStateConfig } from "./config";

// Client State (Zustand)
export { createClientStore } from "./client-state";

