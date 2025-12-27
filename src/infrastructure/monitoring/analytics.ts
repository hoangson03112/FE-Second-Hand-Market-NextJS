/**
 * Analytics Configuration
 *
 * Supports multiple analytics providers:
 * - Vercel Analytics (Web Vitals)
 * - PostHog (Product Analytics)
 * - Google Analytics (optional)
 */

// Vercel Analytics (already included in Next.js)
// import { Analytics } from '@vercel/analytics/react';

// PostHog Configuration
// Install: npm install posthog-js
/*
import posthog from 'posthog-js';

if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') {
        posthog.debug();
      }
    },
  });
}
*/

/**
 * Track page views
 */
export const trackPageView = (path: string) => {
  if (typeof window === "undefined") return;

  // PostHog
  // posthog?.capture('$pageview', { path });

  // Google Analytics
  // window.gtag?.('config', process.env.NEXT_PUBLIC_GA_ID, { page_path: path });

  console.log("Page view:", path);
};

/**
 * Track custom events
 */
export const trackEvent = (
  eventName: string,
  properties?: Record<string, unknown>
) => {
  if (typeof window === "undefined") return;

  // PostHog
  // posthog?.capture(eventName, properties);

  // Google Analytics
  // window.gtag?.('event', eventName, properties);

  console.log("Event:", eventName, properties);
};

/**
 * Identify user
 */
export const identifyUser = (
  userId: string,
  traits?: Record<string, unknown>
) => {
  if (typeof window === "undefined") return;

  // PostHog
  // posthog?.identify(userId, traits);

  console.log("User identified:", userId, traits);
};
