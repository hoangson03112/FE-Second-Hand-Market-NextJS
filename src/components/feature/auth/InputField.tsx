import { ChangeEvent, FocusEvent, ReactNode } from "react";

interface InputFieldProps {
  id: string;
  name: string;
  type?: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  icon?: ReactNode;
  error?: string;
}

export default function InputField({
  id,
  name,
  type = "text",
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  icon,
  error,
}: InputFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
            {icon}
          </div>
        )}
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`block w-full ${icon ? "pl-10" : "pl-4"} pr-4 py-3 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition ${
            error ? "border-destructive focus:ring-destructive/20" : "border-input"
          }`}
          placeholder={placeholder}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
