import { ReactNode } from "react";

interface BackgroundProps {
  children?: ReactNode;
  className?: string;
}

export default function Background({ children, className = "" }: BackgroundProps) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-cream-50 via-beige-50 to-taupe-50 ${className}`}>
      {/* Subtle radial overlays */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-taupe-400/10 rounded-full blur-3xl"></div>
      </div>
      
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  );
}

