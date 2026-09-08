import React from "react";
import { cn } from "@/lib/utils";

interface SuccessMessageProps {
  icon: React.ReactNode;
  title: string;
  description: string | React.ReactNode;
  hint?: string;
}

export default function SuccessMessage({
  icon,
  title,
  description,
  hint,
}: SuccessMessageProps) {
  return (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-taupe-100 to-taupe-50 rounded-full flex items-center justify-center">
        {icon}
      </div>

      <div className="space-y-3">
        <h3
          className={cn("font-droid-serif text-xl text-luxury-ink", "font-normal")}
        >
          {title}
        </h3>
        <div className="text-taupe-600 leading-relaxed">{description}</div>
        {hint && <p className="text-sm text-taupe-500">{hint}</p>}
      </div>
    </div>
  );
}
