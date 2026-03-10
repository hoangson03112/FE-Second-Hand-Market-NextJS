import React from "react";

export default function Divider() {
  return (
    <div className="relative py-4">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-taupe-200" />
      </div>
      <div className="relative flex justify-center text-[14px]">
        <span className="px-4 bg-white/80 text-taupe-500 font-medium">Hoặc</span>
      </div>
    </div>
  );
}