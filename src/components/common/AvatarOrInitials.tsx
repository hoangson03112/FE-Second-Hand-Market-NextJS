"use client";

import { useState } from "react";
import Image from "next/image";
import { getUserInitials } from "@/utils";

interface AvatarOrInitialsProps {
  /** URL string hoặc object { url } */
  avatar?: string | { url?: string } | null;
  fullName?: string;
  size?: number;
  className?: string;
  alt?: string;
}

/** Hiển thị avatar nếu có, fallback chữ cái đầu từ tên */
export function AvatarOrInitials({
  avatar,
  fullName = "",
  size = 32,
  className = "",
  alt,
}: AvatarOrInitialsProps) {
  const [imgError, setImgError] = useState(false);
  const url =
    typeof avatar === "string" ? avatar : (avatar as { url?: string })?.url ?? null;

  if (url && !imgError) {
    return (
      <Image
        src={url}
        alt={alt ?? fullName ?? "Avatar"}
        width={size}
        height={size}
        className={`object-cover rounded-full flex-shrink-0 ${className}`}
        onError={() => setImgError(true)}
      />
    );
  }

  const initials = getUserInitials(fullName) || "?";
  return (
    <span
      className={`flex items-center justify-center rounded-full bg-primary/10 text-primary font-semibold flex-shrink-0 ${className}`}
      style={{ width: size, height: size, fontSize: Math.max(10, size * 0.4) }}
    >
      {initials}
    </span>
  );
}
