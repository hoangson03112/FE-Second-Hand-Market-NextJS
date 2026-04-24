"use client";

import { ReactNode } from "react";
import { IconX } from "@tabler/icons-react";

interface ModalHeaderProps {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  onClose: () => void;
  closeDisabled?: boolean;
  className?: string;
}

export function ModalHeader({
  icon,
  title,
  subtitle,
  onClose,
  closeDisabled = false,
  className = "",
}: ModalHeaderProps) {
  return (
    <div className={`flex items-start justify-between px-6 py-5 border-b-2 border-neutral-200/60 ${className}`}>
      <div className="flex items-center gap-3">
        {icon && (
          <div className="w-10 h-10 rounded-2xl bg-neutral-100 flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-lg font-bold text-neutral-900">{title}</h3>
          {subtitle && <p className="text-xs text-neutral-500">{subtitle}</p>}
        </div>
      </div>
      <button
        onClick={onClose}
        disabled={closeDisabled}
        className="p-2 hover:bg-secondary rounded-full transition-colors disabled:opacity-50"
        type="button"
      >
        <IconX className="w-5 h-5 text-neutral-500" />
      </button>
    </div>
  );
}
