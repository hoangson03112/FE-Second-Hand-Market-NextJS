import React from "react";

export default function Divider() {
  return (
    <div className="relative py-2">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-3 bg-card text-muted-foreground">Hoặc</span>
      </div>
    </div>
  );
}
