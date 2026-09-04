import React from "react";
import { IconAlertCircle } from "@tabler/icons-react";

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-2.5 bg-blush-50/70 border border-blush-200 p-3.5 rounded-[2px]">
      <IconAlertCircle className="w-4 h-4 text-blush-600 shrink-0 mt-0.5" />
      <p className="text-xs text-blush-800 leading-relaxed font-medium">{message}</p>
    </div>
  );
}
