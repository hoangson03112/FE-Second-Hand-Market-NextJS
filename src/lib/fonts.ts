import { Geist, Plus_Jakarta_Sans, Noto_Serif } from "next/font/google";

// Geist (SF-inspired) — self-hosted via next/font so it renders identically on
// every platform (Windows / Android / iOS). Variable font: full 100–900 range
// from a single file. Geist has no separate `vietnamese` subset; its Vietnamese
// glyphs (U+1E00–1EFF, Ăă/Đđ/Ơơ/Ưư) ship inside `latin-ext`.
export const geist = Geist({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-geist",
  preload: true,
  fallback: [
    "-apple-system",
    "BlinkMacSystemFont",
    "SF Pro Text",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
});

// Plus Jakarta Sans — a clean, modern geometric sans used for the homepage
// (headings + body). Variable font (weights 200–800) with a dedicated
// `vietnamese` subset, so all diacritics render natively. Includes a real
// italic axis for the accent line. Self-hosted via next/font (--font-jakarta).
export const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext", "vietnamese"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-jakarta",
  preload: true,
  fallback: [
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
});

// Noto Serif — the hero display heading serif. Regular weight (400) for the
// thin look in the reference. Dedicated `vietnamese` subset so all Vietnamese
// diacritics render correctly. Self-hosted via next/font (--font-noto-serif).
export const notoSerif = Noto_Serif({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto-serif",
  preload: true,
  fallback: ["Georgia", "Cambria", "Times New Roman", "serif"],
});
