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
      className="w-full flex justify-center items-center gap-2 py-3.5 px-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition disabled:opacity-50 disabled:pointer-events-none"
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Đang xử lý...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
