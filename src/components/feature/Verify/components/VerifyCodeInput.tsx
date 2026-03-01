interface VerifyCodeInputProps {
  code: string;
  onCodeChange: (code: string) => void;
  onClearError: () => void;
}

export default function VerifyCodeInput({
  code,
  onCodeChange,
  onClearError,
}: VerifyCodeInputProps) {
  return (
    <div>
      <label
        htmlFor="code"
        className="block text-sm font-semibold text-secondary mb-3 text-center"
      >
        Nhập mã xác thực
      </label>
      <div className="flex gap-2 justify-center">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={code[index] || ""}
            onChange={(e) => {
              const newCode = code.split("");
              newCode[index] = e.target.value.replace(/\D/g, "");
              onCodeChange(newCode.join("").slice(0, 6));
              onClearError();
              // Auto focus next input
              if (e.target.value && index < 5) {
                const nextInput = document.getElementById(`code-${index + 1}`);
                nextInput?.focus();
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !code[index] && index > 0) {
                const prevInput = document.getElementById(`code-${index - 1}`);
                prevInput?.focus();
              }
            }}
            id={`code-${index}`}
            className="w-14 h-16 text-center text-3xl font-bold bg-neutral/50 border-2 border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        ))}
      </div>
      <p className="mt-4 text-xs text-tertiary text-center">
        Kiểm tra hộp thư đến và nhập mã 6 số
      </p>
    </div>
  );
}
