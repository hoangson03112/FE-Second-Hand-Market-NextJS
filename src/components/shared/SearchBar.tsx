"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { SearchInput } from "./SearchInput";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  /** Fired on submit, or debounced (if `debounceMs` is set). */
  onSearch?: (value: string) => void;
  placeholder?: string;
  buttonText?: string;
  loading?: boolean;
  className?: string;
  /** When set, search fires debounced instead of only on submit. */
  debounceMs?: number;
}

/**
 * SearchBar — a `SearchInput` paired with a submit `AppButton` in a form.
 */
export function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder,
  buttonText = "Tìm",
  loading,
  className,
  debounceMs,
}: SearchBarProps) {
  const [query, setQuery] = React.useState(value ?? "");

  React.useEffect(() => {
    if (value !== undefined) setQuery(value);
  }, [value]);

  return (
    <form
      className={cn("flex items-center gap-2", className)}
      onSubmit={(e) => {
        e.preventDefault();
        onSearch?.(query);
      }}
    >
      <SearchInput
        value={query}
        onChange={(v) => {
          setQuery(v);
          onChange?.(v);
        }}
        onDebouncedChange={debounceMs ? onSearch : undefined}
        debounceMs={debounceMs}
        placeholder={placeholder}
        containerClassName="flex-1"
      />
      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="size-4 animate-spin mr-2" />}
        {buttonText}
      </Button>
    </form>
  );
}
