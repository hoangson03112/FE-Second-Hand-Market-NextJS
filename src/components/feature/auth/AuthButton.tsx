import React from "react";

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
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className="w-full group relative overflow-hidden flex justify-center items-center gap-2 py-4 px-6 bg-gradient-to-r from-primary via-primary-dark to-primary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    >
      <span className="relative z-10 flex items-center gap-2">
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            <span>Đang xử lý...</span>
          </>
        ) : (
          children
        )}
      </span>
      <div className="absolute inset-0 bg-gradient-to-r from-primary-dark to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </button>
  );
}

