"use client";

import * as React from "react";
import { IconSearch, IconX } from "@tabler/icons-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface SearchInputProps
  extends Omit<React.ComponentProps<typeof Input>, "onChange" | "value"> {
  value?: string;
  onChange?: (value: string) => void;

  onDebouncedChange?: (value: string) => void;
  debounceMs?: number;
  onClear?: () => void;
  containerClassName?: string;
}


export function SearchInput({
  value,
  onChange,
  onDebouncedChange,
  debounceMs = 300,
  onClear,
  placeholder = "Tìm kiếm...",
  className,
  containerClassName,
  ...props
}: SearchInputProps) {
  const [internal, setInternal] = React.useState(value ?? "");

  React.useEffect(() => {
    if (value !== undefined) setInternal(value);
  }, [value]);

  const cbRef = React.useRef(onDebouncedChange);
  cbRef.current = onDebouncedChange;
  const firstRun = React.useRef(true);

  React.useEffect(() => {
    if (!cbRef.current) return;
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const timer = setTimeout(() => cbRef.current?.(internal), debounceMs);
    return () => clearTimeout(timer);
  }, [internal, debounceMs]);

  const update = (next: string) => {
    setInternal(next);
    onChange?.(next);
  };

  return (
    <div className={cn("relative", containerClassName)}>
      <IconSearch className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
      <Input
        value={internal}
        onChange={(e) => update(e.target.value)}
        placeholder={placeholder}
        className={cn("pl-9", internal && "pr-9", className)}
        {...props}
      />
      {internal && (
        <button
          type="button"
          onClick={() => {
            update("");
            onClear?.();
          }}
          aria-label="Xóa tìm kiếm"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-neutral-500 transition-colors hover:text-luxury-ink"
        >
          <IconX className="size-4" />
        </button>
      )}
    </div>
  );
}
