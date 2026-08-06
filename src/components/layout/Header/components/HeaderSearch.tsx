"use client";

import { useState, useRef, useEffect } from "react";
import { IconSearch, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface SearchFormProps {
  query: string;
  setQuery: (value: string) => void;
  submitSearch: (event: React.FormEvent) => void;
  className?: string;
}

export default function SearchForm({
  query,
  setQuery,
  submitSearch,
  className,
}: SearchFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node) &&
        !query
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [query]);

  return (
    <div
      ref={wrapperRef}
      className={cn("relative flex items-center justify-end", className)}
    >
      <form
        onSubmit={submitSearch}
        className={cn(
          "flex items-center overflow-hidden border transition-all duration-300 ease-out",
          isOpen
            ? "w-56 border-luxury-ink/15 bg-cream-50/70 pl-3.5 sm:w-72 focus-within:border-luxury-champagne focus-within:bg-white"
            : "w-9 border-transparent bg-transparent",
        )}
        style={{ borderRadius: "2px" }}
      >
        <button
          type={isOpen ? "submit" : "button"}
          onClick={() => !isOpen && setIsOpen(true)}
          aria-label="Tìm kiếm"
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center text-luxury-ink transition-colors",
            !isOpen && "hover:text-luxury-champagne",
          )}
        >
          <IconSearch className="h-[18px] w-[18px]" strokeWidth={1.75} />
        </button>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Tìm kiếm sản phẩm..."
          className={cn(
            "h-9 bg-transparent text-[13px] font-medium text-luxury-ink placeholder:font-normal placeholder:text-taupe-400/80 focus:outline-none transition-all duration-300",
            isOpen ? "w-full px-2 opacity-100" : "w-0 px-0 opacity-0",
          )}
        />

        {isOpen && query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="mr-2 shrink-0 p-1 text-text-luxury-ink transition-colors hover:text-luxury-ink-70"
            aria-label="Xóa tìm kiếm"
          >
            <IconX className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        )}
      </form>
    </div>
  );
}
