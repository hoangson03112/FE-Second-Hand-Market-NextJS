import React from "react";
import { Button } from "@/components/shared";

interface AuthButtonProps {
  type?: "button" | "submit" | "reset";
  isLoading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export default function AuthButton({
  type = "submit",
  isLoading = false,
  disabled = false,
  children,
  onClick,
}: AuthButtonProps) {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      fullWidth
      loading={isLoading}
      className="bg-primary text-primary-foreground hover:bg-primary/90  p-6 text-[15px] active:scale-[0.98] duration-200"
    >
      {isLoading ? "Đang xử lý..." : children}
    </Button>
  );
}
