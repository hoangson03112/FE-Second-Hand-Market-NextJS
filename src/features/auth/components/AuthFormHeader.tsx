interface AuthFormHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
}

export default function AuthFormHeader({
  eyebrow,
  title,
  description,
}: AuthFormHeaderProps) {
  return (
    <div className="mb-9">
      <div className="flex items-center gap-3">
        <span className="h-px w-8 bg-luxury-champagne/80" aria-hidden />
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-600">
          {eyebrow}
        </p>
      </div>

      <h1
        className="mt-4 text-[clamp(1.875rem,3.2vw,2.5rem)] tracking-tight text-luxury-ink"
        style={{
          fontFamily: "var(--font-droid-serif), serif",
          fontWeight: 400,
          lineHeight: 1.08,
          letterSpacing: "-0.03em",
        }}
      >
        {title}
      </h1>

      {description ? (
        <p className="mt-4 text-sm leading-relaxed text-neutral-600">
          {description}
        </p>
      ) : null}
    </div>
  );
}
