import { cn } from "@/lib/utils";
import { Eyebrow } from "./Eyebrow";

const serif = { fontFamily: "var(--font-droid-serif), serif" };

interface PanelProps {
  eyebrow?: string;
  title?: React.ReactNode;
  /** Sits under the title, for a one-line hint about the panel. */
  description?: React.ReactNode;
  /** Rendered at the far end of the panel header. */
  aside?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  /**
   * `flush` drops the body padding for panels that render their own rows or
   * divided lists and need the dividers to reach the panel edge.
   */
  padding?: "default" | "flush";
  id?: string;
}

/**
 * The one surface shape shared by checkout and order detail: white sheet,
 * hairline ink border, 2px corners, eyebrow + serif title in a bordered header.
 *
 * Both screens render the same object at different stages of its life, so they
 * are built from this rather than from two lookalike card styles.
 */
export function Panel({
  eyebrow,
  title,
  description,
  aside,
  children,
  className,
  bodyClassName,
  padding = "default",
  id,
}: PanelProps) {
  return (
    <section
      id={id}
      className={cn(
        "overflow-hidden rounded-[2px] border border-luxury-ink/10 bg-white",
        className,
      )}
    >
      {eyebrow || title ? (
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-luxury-ink/10 px-5 py-5 sm:px-6">
          <div className="min-w-0">
            {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
            {title ? (
              <h2
                style={serif}
                className={cn(
                  "text-lg tracking-tight text-luxury-ink",
                  eyebrow && "mt-3",
                )}
              >
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-2 text-xs leading-relaxed text-neutral-500">
                {description}
              </p>
            ) : null}
          </div>
          {aside}
        </header>
      ) : null}

      <div
        className={cn(
          padding === "default" && "px-5 py-6 sm:px-6",
          bodyClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}

export default Panel;
