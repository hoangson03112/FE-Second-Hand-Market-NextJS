
export const serverStateConfig = {

  staleTime: {

    static: 30 * 60 * 1000, // 30 minutes (categories, etc.)


    semiDynamic: 5 * 60 * 1000, // 5 minutes (products list, etc.)


    dynamic: 1 * 60 * 1000, // 1 minute (user orders, etc.)


    realtime: 0, // Always stale (chat, notifications, etc.)
  },


  gcTime: {
    static: 60 * 60 * 1000, // 1 hour
    semiDynamic: 30 * 60 * 1000, // 30 minutes
    dynamic: 10 * 60 * 1000, // 10 minutes
    realtime: 5 * 60 * 1000, // 5 minutes
  },
} as const;

