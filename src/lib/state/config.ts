/**
 * State Management Configuration
 * 
 * This file defines patterns and conventions for managing state in the application:
 * 
 * - CLIENT STATE: Use Zustand (in /store folder)
 *   - UI state (modals, forms, filters)
 *   - User preferences
 *   - Authentication state
 *   - Local app state
 * 
 * - SERVER STATE: Use TanStack Query (in /hooks folder)
 *   - Data from API
 *   - Cached server responses
 *   - Async data fetching
 *   - Background refetching
 */

/**
 * Server State Query Configuration
 * Use this pattern for TanStack Query hooks
 */
export const serverStateConfig = {
  // Default stale times for different data types (in milliseconds)
  staleTime: {
    // Static data that rarely changes
    static: 30 * 60 * 1000, // 30 minutes (categories, etc.)
    
    // Semi-dynamic data
    semiDynamic: 5 * 60 * 1000, // 5 minutes (products list, etc.)
    
    // Dynamic data that changes frequently
    dynamic: 1 * 60 * 1000, // 1 minute (user orders, etc.)
    
    // Real-time data
    realtime: 0, // Always stale (chat, notifications, etc.)
  },
  
  // Default cache times (in milliseconds)
  gcTime: {
    static: 60 * 60 * 1000, // 1 hour
    semiDynamic: 30 * 60 * 1000, // 30 minutes
    dynamic: 10 * 60 * 1000, // 10 minutes
    realtime: 5 * 60 * 1000, // 5 minutes
  },
} as const;

/**
 * State Management Guidelines
 * 
 * When to use CLIENT STATE (Zustand):
 * - ✅ UI state (modals, dropdowns, form inputs)
 * - ✅ User preferences (theme, language)
 * - ✅ Authentication tokens
 * - ✅ Temporary calculations
 * - ✅ Client-side filters/sorting
 * 
 * When to use SERVER STATE (TanStack Query):
 * - ✅ Data fetched from API
 * - ✅ Data that needs caching
 * - ✅ Data that needs background refetching
 * - ✅ Data shared across components
 * - ✅ Optimistic updates
 * 
 * When NOT to use either:
 * - ❌ Component-local state → use useState
 * - ❌ Derived state → use useMemo/useCallback
 * - ❌ URL state → use useSearchParams (Next.js)
 */

