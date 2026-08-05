"use client";


import { IconArrowLeft } from "@tabler/icons-react";
interface CartHeaderProps {
  onBack: () => void;
}

export default function CartHeader({ onBack }: CartHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-luxury-ivory/95 backdrop-blur-md border-b border-luxury-ink/10">
      <div className="max-w-9xl mx-auto px-4 h-16 flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 -ml-2 hover:bg-taupe-50 rounded-[2px] transition-colors"
          type="button"
          aria-label="Quay lại"
        >
          <IconArrowLeft className="h-5 w-5 text-luxury-ink" />
        </button>
        <h1 className="text-2xl text-luxury-ink flex-1" style={{ fontFamily: "var(--font-droid-serif), serif" }}>Giỏ Hàng</h1>
      </div>
    </header>
  );
}
