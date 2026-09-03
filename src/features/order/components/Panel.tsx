import { cn } from "@/lib/utils";
import { Eyebrow } from "./Eyebrow";

interface PanelProps {
  eyebrow?: string;
  title?: React.ReactNode;

  description?: React.ReactNode;

  aside?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;

  padding?: "default" | "flush";
  id?: string;
}


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
                className={cn(
"font-droid-serif",
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
