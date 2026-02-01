import React from "react";
import Link from "next/link";
import Image from "next/image";

interface AuthFormContainerProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  maxHeight?: string;
}

export default function AuthFormContainer({
  title,
  subtitle,
  children,
  maxHeight,
}: AuthFormContainerProps) {
  return (
    <div className="w-full">
      <div className="lg:hidden flex justify-center mb-4">
        <Link href="/" className="inline-block">
          <Image
            src="https://res.cloudinary.com/dqvtj4uxo/image/upload/v1755696284/logi_ov2gbl.png"
            alt="Eco Market"
            width={80}
            height={80}
            className="h-14 w-auto"
            priority
          />
        </Link>
      </div>
      <div
        className={`rounded-2xl border border-border bg-card shadow-xl p-5 sm:p-6 lg:p-8 space-y-4 ${
          maxHeight ? `${maxHeight} overflow-y-auto` : ""
        }`}
      >
        <div className="space-y-0.5">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            {title}
          </h2>
          <p className="text-muted-foreground text-sm">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
