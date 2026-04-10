
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


