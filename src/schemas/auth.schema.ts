import { z } from "zod";

// Regex patterns
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
const PHONE_REGEX = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;

// Login Schema
export const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Tên đăng nhập không được để trống")
    .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự")
    .max(20, "Tên đăng nhập không được quá 20 ký tự")
    .regex(USERNAME_REGEX, "Tên đăng nhập chỉ chứa chữ, số và dấu gạch dưới")
    .trim(),

  password: z
    .string()
    .min(1, "Mật khẩu không được để trống")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Register Schema
export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Họ tên phải có ít nhất 2 ký tự")
      .max(50, "Họ tên không được quá 50 ký tự")
      .regex(/^[a-zA-ZÀ-ỹ\s]+$/, "Họ tên chỉ chứa chữ cái và khoảng trắng")
      .trim()
      .optional(),

    username: z
      .string()
      .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự")
      .max(20, "Tên đăng nhập không được quá 20 ký tự")
      .regex(USERNAME_REGEX, "Tên đăng nhập chỉ chứa chữ, số và dấu gạch dưới")
      .trim(),

    email: z
      .string()
      .min(1, "Email không được để trống")
      .email("Email không hợp lệ")
      .max(100, "Email không được quá 100 ký tự")
      .toLowerCase()
      .trim(),

    phoneNumber: z
      .string()
      .min(10, "Số điện thoại phải có ít nhất 10 số")
      .max(12, "Số điện thoại không hợp lệ")
      .regex(
        PHONE_REGEX,
        "Số điện thoại không hợp lệ (phải bắt đầu bằng 0 hoặc +84)"
      )
      .trim(),

    password: z
      .string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .max(50, "Mật khẩu không được quá 50 ký tự"),

    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
