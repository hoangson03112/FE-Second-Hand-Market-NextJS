import { ReactNode } from "react";

interface BackgroundProps {
  children?: ReactNode;
  className?: string;
}

export default function Background({ children, className = "" }: BackgroundProps) {
  return (
    <div className={`min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-cream-50 to-taupe-50 ${className}`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blush-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-taupe-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  );
}

