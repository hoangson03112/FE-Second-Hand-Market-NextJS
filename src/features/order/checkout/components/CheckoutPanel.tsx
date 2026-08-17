export { Panel as default } from "@/features/order/components";

/**
 * Checkout's panel is the shared order `Panel` — kept as a named module so the
 * existing checkout imports stay put while there is only one surface style to
 * maintain across checkout and order detail.
 */
