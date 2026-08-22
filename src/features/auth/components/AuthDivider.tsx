interface AuthDividerProps {
  label?: string;
}

export default function AuthDivider({ label = "Hoặc" }: AuthDividerProps) {
  return (
    <div className="flex items-center gap-4" aria-hidden>
      <span className="h-px flex-1 bg-luxury-ink/10" />
      <span className="text-2xs font-bold uppercase tracking-[0.28em] text-neutral-500">
        {label}
      </span>
      <span className="h-px flex-1 bg-luxury-ink/10" />
    </div>
  );
}
