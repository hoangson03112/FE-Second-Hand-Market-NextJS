import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/shared/Eyebrow";

interface CheckoutPanelProps {
  eyebrow?: string;
  title?: React.ReactNode;
  /** Rendered at the far end of the panel header. */
  aside?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

/**
 * The one surface shape used across checkout: white sheet, hairline ink border,
 * 2px corners, eyebrow + serif title in a bordered header.
 */
export default function CheckoutPanel({
  eyebrow,
  title,
  aside,
  children,
  className,
  bodyClassName,
}: CheckoutPanelProps) {
  return (
    <section
      className={cn(
        "rounded-[2px] border border-luxury-ink/10 bg-white",
        className,
      )}
    >
      {eyebrow || title ? (
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-luxury-ink/10 px-5 py-5 sm:px-6">
          <div>
            {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
            {title ? (
              <h2
                style={{ fontFamily: "var(--font-droid-serif), serif" }}
                className={cn(
                  "text-lg tracking-tight text-luxury-ink",
                  eyebrow && "mt-3",
                )}
              >
                {title}
              </h2>
            ) : null}
          </div>
          {aside}
        </header>
      ) : null}

      <div className={cn("px-5 py-6 sm:px-6", bodyClassName)}>{children}</div>
    </section>
  );
}
