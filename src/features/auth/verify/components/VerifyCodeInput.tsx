"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

const CELLS = [0, 1, 2, 3, 4, 5];

interface VerifyCodeInputProps {
  code: string;
  onCodeChange: (code: string) => void;
  onClearError: () => void;
  /** Tô viền cảnh báo khi mã bị từ chối. */
  hasError?: boolean;
  label?: string;
  hint?: string;
}

export default function VerifyCodeInput({
  code,
  onCodeChange,
  onClearError,
  hasError = false,
  label = "Mã xác thực",
  hint = "Kiểm tra cả hộp thư Spam nếu bạn không thấy email.",
}: VerifyCodeInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const focusCell = (index: number) => {
    inputsRef.current[Math.min(Math.max(index, 0), CELLS.length - 1)]?.focus();
  };

  useEffect(() => {
    focusCell(0);
  }, []);

  /** Ghi digits vào chuỗi mã bắt đầu từ vị trí `start`, trả về vị trí con trỏ kế tiếp. */
  const writeDigits = (start: number, digits: string) => {
    const next = code.padEnd(CELLS.length, " ").split("");
    for (let i = 0; i < digits.length && start + i < CELLS.length; i += 1) {
      next[start + i] = digits[i];
    }
    onCodeChange(next.join("").replace(/ /g, "").slice(0, CELLS.length));
    onClearError();
    return Math.min(start + digits.length, CELLS.length - 1);
  };

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label
          htmlFor="code-0"
          className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500"
        >
          {label}
        </label>
        <span
          aria-hidden
          className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400"
        >
          <span className={cn(code.length === 6 && "text-luxury-ink")}>
            {code.length}
          </span>
          {" / 6"}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-6 gap-2 sm:gap-2.5">
        {CELLS.map((index) => {
          const value = code[index] ?? "";

          return (
            <input
              key={index}
              ref={(el) => {
                inputsRef.current[index] = el;
              }}
              id={`code-${index}`}
              type="text"
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              maxLength={1}
              value={value}
              aria-label={`Chữ số thứ ${index + 1}`}
              aria-invalid={hasError || undefined}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "");
                if (!digits) return;
                focusCell(writeDigits(index, digits));
              }}
              onKeyDown={(e) => {
                if (e.key === "Backspace") {
                  e.preventDefault();
                  const target = code[index] ? index : index - 1;
                  if (target < 0) return;
                  const next = code.split("");
                  next[target] = "";
                  onCodeChange(next.join(""));
                  onClearError();
                  focusCell(target);
                  return;
                }
                if (e.key === "ArrowLeft") {
                  e.preventDefault();
                  focusCell(index - 1);
                }
                if (e.key === "ArrowRight") {
                  e.preventDefault();
                  focusCell(index + 1);
                }
              }}
              onPaste={(e) => {
                e.preventDefault();
                const digits = e.clipboardData
                  .getData("text")
                  .replace(/\D/g, "")
                  .slice(0, CELLS.length - index);
                if (!digits) return;
                focusCell(writeDigits(index, digits));
              }}
              onFocus={(e) => e.target.select()}
              className={cn(
                "font-droid-serif h-14 w-full rounded-[2px] border bg-white/70 text-center text-2xl leading-none text-luxury-ink",
                "outline-none transition-colors duration-300 sm:h-16 sm:text-[28px]",
                "focus:border-luxury-ink/45 focus:ring-[3px] focus:ring-accent/15",
                hasError
                  ? "border-destructive/60"
                  : value
                    ? "border-luxury-ink/40"
                    : "border-luxury-ink/15",
              )}
            />
          );
        })}
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-neutral-500">{hint}</p>
    </div>
  );
}
