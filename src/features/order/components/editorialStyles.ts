/**
 * The editorial vocabulary shared by every screen that renders an order —
 * buyer list, buyer detail, seller queue.
 *
 * These strings were copy-pasted between the buyer order card and the seller
 * order screen, so a tweak to the ink fill drifted between two views of the
 * same object. They live here so all of them read as one publication.
 */

/**
 * The display face is the `font-droid-serif` class from `styles/base.css` —
 * applied as a className, not as an inline style object, so it composes with
 * `cn()` like every other token here.
 */

/** Micro-caps label — the quiet counterpart to the serif figures. */
export const microCaps = "text-2xs font-medium uppercase tracking-[0.15em]";

/** Ink-filled primary action. */
export const primaryAction =
  "inline-flex h-10 items-center justify-center gap-2 rounded-[2px] bg-luxury-ink px-6 text-2xs font-bold uppercase tracking-[0.15em] text-luxury-ivory transition-all duration-300 hover:bg-charcoal-800 disabled:cursor-not-allowed disabled:opacity-40";

/** Hairline secondary action that fills with ink on hover. */
export const outlineAction =
  "inline-flex h-10 items-center justify-center gap-2 rounded-[2px] border border-luxury-ink/15 px-6 text-2xs font-bold uppercase tracking-[0.15em] text-luxury-ink transition-all duration-300 hover:border-luxury-ink hover:bg-luxury-ink hover:text-luxury-ivory disabled:cursor-not-allowed disabled:opacity-40";

/** Destructive action stays in the warm blush ramp, never raw red. */
export const dangerAction =
  "inline-flex h-10 items-center justify-center gap-2 rounded-[2px] border border-blush-300 px-6 text-2xs font-bold uppercase tracking-[0.15em] text-blush-700 transition-all duration-300 hover:bg-blush-50 disabled:cursor-not-allowed disabled:opacity-40";

/**
 * Compact forms of the three actions above, for the card footers where a 40px
 * button would crowd out the content. Same vocabulary, one step quieter.
 */
export const primaryActionSm =
  "inline-flex h-9 items-center justify-center gap-1.5 rounded-[2px] bg-luxury-ink px-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-luxury-ivory transition-all duration-300 hover:bg-charcoal-800 disabled:cursor-not-allowed disabled:opacity-40";

export const outlineActionSm =
  "inline-flex h-9 items-center justify-center gap-1.5 rounded-[2px] border border-luxury-ink/15 px-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-luxury-ink transition-all duration-300 hover:border-luxury-ink hover:bg-luxury-ink hover:text-luxury-ivory disabled:cursor-not-allowed disabled:opacity-40";

export const dangerActionSm =
  "inline-flex h-9 items-center justify-center gap-1.5 rounded-[2px] border border-blush-300 px-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-blush-700 transition-all duration-300 hover:bg-blush-50 disabled:cursor-not-allowed disabled:opacity-40";

/** Tonal grounds for the advisory blocks (refund progress, warnings, hints). */
export const NOTICE_TONE_CLASS = {
  success: "border-accent/35 bg-taupe-50",
  warning: "border-luxury-champagne/45 bg-cream-100/70",
  info: "border-luxury-ink/12 bg-cream-50/70",
  neutral: "border-luxury-ink/10 bg-white",
} as const;

export type NoticeTone = keyof typeof NOTICE_TONE_CLASS;
