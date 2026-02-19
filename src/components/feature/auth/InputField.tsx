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
    <div className="space-y-2">
      <label htmlFor={id} className="block text-[14px] font-semibold text-taupe-900">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-taupe-400">
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
          className={`block w-full ${icon ? "pl-12" : "pl-4"} pr-4 py-3.5 border bg-white text-taupe-900 text-[15px] rounded-xl placeholder:text-taupe-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${
            error ? "border-red-500 focus:ring-red-500/20" : "border-gray-200 hover:border-gray-300"
          }`}
          placeholder={placeholder}
        />
      </div>
      {error && <p className="text-[13px] font-medium text-red-600 mt-1.5">{error}</p>}
    </div>
  );
}
