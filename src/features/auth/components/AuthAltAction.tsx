import Link from "next/link";
import { IconArrowUpRight } from "@tabler/icons-react";

interface AuthAltActionProps {
  question: string;
  href: string;
  label: string;
}

export default function AuthAltAction({
  question,
  href,
  label,
}: AuthAltActionProps) {
  return (
    <div className="border-t border-luxury-ink/10 pt-6 text-center">
      <p className="text-xs text-neutral-600">{question}</p>
      <Link
        href={href}
        className="group mt-2.5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-luxury-ink transition-colors hover:text-taupe-700"
      >
        {label}
        <IconArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    </div>
  );
}
