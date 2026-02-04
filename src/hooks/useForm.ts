import { useState, ChangeEvent } from "react";

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

  /**
   * ✅ Hàm handleChange chung cho TẤT CẢ input types
   * Hỗ trợ: input, textarea, select
   */
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    // Handle checkbox
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setValues({
        ...values,
        [name]: checked,
      });
    } else {
      // Handle text, number, select, textarea, etc.
      setValues({
        ...values,
        [name]: value,
      });
    }

    // Clear error khi user đang typing
    if (errors[name as keyof T]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  /**
   * Set giá trị cho một field cụ thể
   */
  const setValue = (name: keyof T, value: T[keyof T]) => {
    setValues({
      ...values,
      [name]: value,
    });
  };

  /**
   * Set nhiều giá trị cùng lúc
   */
  const setMultipleValues = (newValues: Partial<T>) => {
    setValues({
      ...values,
      ...newValues,
    });
  };

  /**
   * Reset form về initial values
   */
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  /**
   * Set error cho một field
   */
  const setFieldError = (name: keyof T, error: string) => {
    setErrors({
      ...errors,
      [name]: error,
    });
  };

  /**
   * Clear error của một field
   */
  const clearFieldError = (name: keyof T) => {
    setErrors({
      ...errors,
      [name]: undefined,
    });
  };

  /**
   * Handle submit
   */
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!onSubmit) return;

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // State
    values,
    errors,
    isSubmitting,

    // Handlers
    handleChange,
    handleSubmit,

    // Setters
    setValue,
    setMultipleValues,
    setFieldError,
    clearFieldError,
    setErrors,

    // Actions
    resetForm,
  };
}

/**
 * ===================================================================
 * EXAMPLE USAGE
 * ===================================================================
 */

// Example 1: Simple form
/*
const MyForm = () => {
  const { values, errors, handleChange, handleSubmit } = useForm({
    initialValues: {
      name: "",
      email: "",
      age: 0,
    },
    onSubmit: async (data) => {
      console.log(data);
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={values.name} onChange={handleChange} />
      {errors.name && <span>{errors.name}</span>}
    </form>
  );
};
*/

// Example 2: Address form
/*
const AddressForm = () => {
  const { values, handleChange, setValue, handleSubmit } = useForm({
    initialValues: {
      province: "",
      district: "",
      ward: "",
      address: "",
    }
  });

  const handleProvinceChange = (e) => {
    const provinceName = getProvinceName(e.target.value);
    setValue("province", provinceName);
    // Reset dependent fields
    setValue("district", "");
    setValue("ward", "");
  };

  return (
    <form onSubmit={handleSubmit}>
      <select name="province" onChange={handleProvinceChange}>...</select>
      <input name="address" value={values.address} onChange={handleChange} />
    </form>
  );
};
*/
