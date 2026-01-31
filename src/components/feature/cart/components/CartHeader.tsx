"use client";

import { ArrowLeft } from "lucide-react";

interface CartHeaderProps {
  onBack: () => void;
}

export default function CartHeader({ onBack }: CartHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-full text-foreground hover:bg-muted transition-colors"
          type="button"
          aria-label="Quay lại"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-semibold text-foreground flex-1">Giỏ hàng</h1>
      </div>
    </header>
  );
}
