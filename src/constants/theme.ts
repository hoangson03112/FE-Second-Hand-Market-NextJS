/**
 * Centralized color system — extracted from the Home page reference design.
 *
 * Design token hierarchy:
 *   1. Prefer Tailwind semantic classes (bg-primary, text-foreground, border-border …)
 *   2. For inline `style={{}}` props that cannot use Tailwind, use the constants below.
 *
 * All values map directly to the CSS custom properties declared in globals.css.
 */

// ---------------------------------------------------------------------------
// Primary accent — warm copper / sienna  (CSS: --primary)
// ---------------------------------------------------------------------------
export const COLORS = {
  /** Warm copper/sienna accent  →  Tailwind: `text-primary / bg-primary / border-primary` */
  PRIMARY: "var(--primary)" as string,
  /** Slightly darker primary for hover states  →  Tailwind: `hover:bg-primary/90` */
  PRIMARY_HOVER: "oklch(0.43 0.08 35)" as string,
  /** Ultra-light primary tint for hover backgrounds  →  Tailwind: `bg-primary/10` */
  PRIMARY_BG: "var(--secondary)" as string,

  // ---------------------------------------------------------------------------
  // Backgrounds — cream / ivory palette  (CSS: --background, --cream-*)
  // ---------------------------------------------------------------------------
  /** Cream-ivory page background  →  Tailwind: `bg-background` or `bg-cream-50` */
  BACKGROUND: "var(--background)" as string,
  /** Cards / panels  →  Tailwind: `bg-card` */
  CARD: "var(--card)" as string,
  /** Warm white surface  →  Tailwind: `bg-cream-50` */
  SURFACE: "#fefcf9" as string,

  // ---------------------------------------------------------------------------
  // Borders  (CSS: --border)
  // ---------------------------------------------------------------------------
  /** Standard border  →  Tailwind: `border-border` */
  BORDER: "var(--border)" as string,
  /** Slightly heavier card border  →  Tailwind: `border-neutral-200` */
  BORDER_CARD: "var(--border)" as string,
  /** Subtle secondary border  →  Tailwind: `border-border/60` */
  BORDER_SUBTLE: "oklch(0.88 0.02 70)" as string,
  /** Divider line  →  Tailwind: `bg-border` */
  BORDER_DIVIDER: "var(--border)" as string,

  // ---------------------------------------------------------------------------
  // Text  (CSS: --foreground, --muted-foreground)
  // ---------------------------------------------------------------------------
  /** Main body text  →  Tailwind: `text-foreground` */
  TEXT_PRIMARY: "var(--foreground)" as string,
  /** Secondary / caption text  →  Tailwind: `text-muted-foreground` */
  TEXT_SECONDARY: "var(--muted-foreground)" as string,
  /** Muted hint text  →  Tailwind: `text-muted-foreground/80` */
  TEXT_MUTED: "var(--muted-foreground)" as string,
  /** Darker body text  →  Tailwind: `text-neutral-700` */
  TEXT_DARK: "var(--neutral-700, oklch(0.4 0.02 50))" as string,

  // ---------------------------------------------------------------------------
  // Interaction backgrounds
  // ---------------------------------------------------------------------------
  /** Hover background for menu items  →  Tailwind: `hover:bg-primary/10` */
  HOVER_BG: "var(--secondary)" as string,
  /** Stronger hover  →  Tailwind: `hover:bg-secondary` */
  HOVER_BG_STRONG: "var(--secondary)" as string,
  /** Very light hover  →  Tailwind: `hover:bg-primary/5` */
  HOVER_BG_LIGHT: "color-mix(in oklch, var(--primary) 8%, white)" as string,

  // ---------------------------------------------------------------------------
  // Dark / foreground buttons
  // ---------------------------------------------------------------------------
  /** Dark CTA button background  →  Tailwind: `bg-foreground` */
  FOREGROUND: "var(--foreground)" as string,
  /** Dark CTA hover  →  Tailwind: `hover:bg-foreground/90` */
  FOREGROUND_HOVER: "oklch(0.2 0.03 270)" as string,
  /** Text on dark background  →  Tailwind: `text-background` or `text-white` */
  FOREGROUND_TEXT: "var(--background)" as string,

  // ---------------------------------------------------------------------------
  // Semantic status colors — intentionally vibrant for status badges
  // ---------------------------------------------------------------------------
  SUCCESS: "#10b981" as string,
  SUCCESS_LIGHT: "#d1fae5" as string,
  WARNING: "#f59e0b" as string,
  WARNING_LIGHT: "#fef3c7" as string,
  ERROR: "#ef4444" as string,
  ERROR_LIGHT: "#fee2e2" as string,

  // ---------------------------------------------------------------------------
  // Decorative / avatar
  // ---------------------------------------------------------------------------
  /** Avatar initials gradient  →  Tailwind: `bg-gradient-to-br from-primary to-primary/60` */
  AVATAR_GRADIENT: "linear-gradient(135deg, var(--primary) 0%, oklch(0.43 0.08 35) 100%)" as string,
  /** Avatar ring border  →  Tailwind: `ring-border` */
  AVATAR_BORDER: "var(--border)" as string,

  /** CTA button gradient (Sell / Register buttons) */
  CTA_GRADIENT: "linear-gradient(135deg, var(--primary) 0%, oklch(0.43 0.08 35) 100%)" as string,
  /** CTA button box shadow */
  CTA_SHADOW: "0 2px 8px color-mix(in oklch, var(--primary) 35%, transparent)" as string,
} as const;

/**
 * Tailwind class shorthands for the most frequently-used color combinations.
 * Import and spread into `className` for consistent styling without string duplication.
 *
 * Example:
 *   import { CX } from "@/constants/theme";
 *   <button className={CX.BTN_PRIMARY}>…</button>
 */
export const CX = {
  // Buttons
  BTN_PRIMARY:
    "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-full font-semibold",
  BTN_DARK:
    "bg-foreground text-background hover:bg-foreground/90 transition-colors rounded-xl font-semibold",
  BTN_GHOST:
    "text-muted-foreground hover:text-primary hover:bg-secondary transition-colors rounded-full",
  BTN_OUTLINE:
    "border border-border text-muted-foreground hover:bg-cream-50 transition-colors rounded-xl",

  // Cards & panels
  CARD: "bg-cream-50 border border-border rounded-2xl",
  CARD_WHITE: "bg-card border border-border rounded-2xl",
  DROPDOWN: "bg-cream-50 border border-border rounded-2xl shadow-xl",

  // Form elements
  INPUT: "bg-input border border-border focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none rounded-xl transition-all",
  TEXTAREA:
    "bg-input border border-border focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none rounded-xl transition-all resize-none",

  // Text shorthands
  T_PRIMARY: "text-foreground",
  T_SECONDARY: "text-muted-foreground",
  T_ACCENT: "text-primary",
} as const;
