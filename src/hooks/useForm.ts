import { useState, ChangeEvent } from "react";
import { sanitizeFieldInput, sanitizeFormValues } from "@/utils";

interface UseFormOptions<T> {
  initialValues: T;
  onSubmit?: (values: T) => void | Promise<void>;
}

export function useForm<T extends Record<string, unknown>>({
  initialValues,
  onSubmit,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;


    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setValues({
        ...values,
        [name]: checked,
      });
    } else {
      const normalizedValue = sanitizeFieldInput(name, value);

      setValues({
        ...values,
        [name]: normalizedValue,
      });
    }


    if (errors[name as keyof T]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };


  const setValue = (name: keyof T, value: T[keyof T]) => {
    setValues({
      ...values,
      [name]: value,
    });
  };


  const setMultipleValues = (newValues: Partial<T>) => {
    setValues({
      ...values,
      ...newValues,
    });
  };


  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };


  const setFieldError = (name: keyof T, error: string) => {
    setErrors({
      ...errors,
      [name]: error,
    });
  };


  const clearFieldError = (name: keyof T) => {
    setErrors({
      ...errors,
      [name]: undefined,
    });
  };


  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!onSubmit) return;

    setIsSubmitting(true);
    try {
      const normalizedValues = sanitizeFormValues(values);
      await onSubmit(normalizedValues);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {

    values,
    errors,
    isSubmitting,


    handleChange,
    handleSubmit,


    setValue,
    setMultipleValues,
    setFieldError,
    clearFieldError,
    setErrors,


    resetForm,
  };
}

