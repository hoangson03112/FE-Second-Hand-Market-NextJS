"use client";

import React from "react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AuthFieldProps extends React.ComponentProps<"input"> {
  label: string;
  /** Leading icon, rendered at 18px in the field gutter. */
  icon?: React.ReactNode;
  /** Adds the champagne asterisk next to the label. */
  requiredMark?: boolean;
  /** Renders the show/hide password toggle. */
  reveal?: boolean;
  fieldClassName?: string;
}

export default function AuthField({
  label,
  icon,
  requiredMark,
  reveal,
  fieldClassName,
  className,
  id,
  name,
  type = "text",
  ...inputProps
}: AuthFieldProps) {
  const [revealed, setRevealed] = React.useState(false);
  const inputId = id ?? name;
  const resolvedType = reveal ? (revealed ? "text" : "password") : type;

  return (
    <div className={cn("group", fieldClassName)}>
      <label
        htmlFor={inputId}
        className="block text-2xs font-bold uppercase tracking-[0.15em] text-neutral-500"
      >
        {label}
        {requiredMark ? (
          <span className="ml-1 text-luxury-champagne" aria-hidden>
            *
          </span>
        ) : null}
      </label>

      <div className="relative mt-2.5">
        {icon ? (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-400 transition-colors duration-300 group-focus-within:text-luxury-ink">
            {icon}
          </span>
        ) : null}

        <Input
          id={inputId}
          name={name}
          type={resolvedType}
          className={cn(
            "h-12 rounded-[2px] border-luxury-ink/15 bg-white/70 text-[15px] text-luxury-ink shadow-none transition-colors duration-300",
            "placeholder:text-neutral-400 placeholder:text-sm",
            "focus-visible:border-luxury-ink/45 focus-visible:ring-[3px] focus-visible:ring-accent/15",
            "aria-invalid:border-destructive/60 aria-invalid:ring-destructive/10",
            icon ? "pl-11" : "pl-4",
            reveal ? "pr-11" : "pr-4",
            className,
          )}
          {...inputProps}
        />

        {reveal ? (
          <button
            type="button"
            onClick={() => setRevealed((prev) => !prev)}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-neutral-400 transition-colors hover:text-luxury-ink"
            aria-label={revealed ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {revealed ? (
              <IconEyeOff className="h-[18px] w-[18px]" />
            ) : (
              <IconEye className="h-[18px] w-[18px]" />
            )}
          </button>
        ) : null}
      </div>
    </div>
  );
}
