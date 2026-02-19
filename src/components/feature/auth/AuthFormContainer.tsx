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
      <div className="lg:hidden flex justify-center mb-8">
        <Link href="/" className="inline-block">
          <Image
            src="https://res.cloudinary.com/dqvtj4uxo/image/upload/v1755696284/logi_ov2gbl.png"
            alt="Eco Market"
            width={100}
            height={100}
            className="h-16 w-auto"
            priority
          />
        </Link>
      </div>
      <div
        className={`bg-white/90 backdrop-blur-md border border-gray-100 rounded-3xl shadow-2xl shadow-taupe-900/10 p-8 sm:p-10 lg:p-12 space-y-8 ${
          maxHeight ? `${maxHeight} overflow-y-auto` : ""
        }`}
      >
        <div className="space-y-3">
          <h2 className="text-[2rem] sm:text-[2.5rem] font-bold text-taupe-900 tracking-tight leading-tight">
            {title}
          </h2>
          <p className="text-taupe-600 text-[15px] font-normal leading-relaxed">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
