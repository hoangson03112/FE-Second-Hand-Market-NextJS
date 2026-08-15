/**
 * Shared field styling for the sell form.
 *
 * These strings used to be copy-pasted into ProductBasicInfo, ProductCategory
 * and ProductDescription, so a tweak in one place silently drifted from the
 * others.
 */

export const INPUT_CLASS =
  "w-full rounded-[2px] border border-luxury-ink/15 bg-white px-3 py-2.5 text-sm text-luxury-ink outline-none transition-colors duration-200 placeholder:text-neutral-400 focus:border-luxury-ink disabled:cursor-not-allowed disabled:bg-cream-100/60";

export const SELECT_CLASS = `${INPUT_CLASS} cursor-pointer appearance-none pr-9`;

export const LABEL_CLASS =
  "mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-600";

export const ERROR_CLASS = "mt-1.5 text-xs leading-relaxed text-blush-700";
