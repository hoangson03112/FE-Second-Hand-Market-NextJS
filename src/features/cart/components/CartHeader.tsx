"use client";


import { IconArrowLeft } from "@tabler/icons-react";
interface CartHeaderProps {
  onBack: () => void;
}

export default function CartHeader({ onBack }: CartHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-card border-b border-default shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 -ml-2 hover:bg-taupe-100 rounded-lg transition-colors"
          type="button"
          aria-label="Quay lại"
        >
          <IconArrowLeft className="h-5 w-5 text-taupe-700" />
        </button>
        <h1 className="text-lg font-semibold text-taupe-900 flex-1">Giỏ Hàng</h1>
      </div>
    </header>
  );
}
