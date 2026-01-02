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
      {/* Mobile Logo */}
      <div className="lg:hidden text-center mb-8">
        <Link href="/" className="inline-block">
          <Image
            src="https://res.cloudinary.com/dqvtj4uxo/image/upload/v1755696284/logi_ov2gbl.png"
            alt="Eco Market Logo"
            width={120}
            height={120}
            className="h-20 w-auto mx-auto"
            priority
          />
        </Link>
      </div>
      <div
        className={`bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 p-8 lg:p-10 space-y-8 ${
          maxHeight ? `${maxHeight} overflow-y-auto` : ""
        }`}
      >
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600">{subtitle}</p>
        </div>

        {children}
      </div>
    </div>
  );
}

