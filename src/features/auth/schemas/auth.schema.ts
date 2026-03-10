import { z } from "zod";

// Format-only validation - không chặt chẽ, đúng format là được

// Username: 3-30 ký tự, chữ/số/chấm/gạch dưới
const usernameSchema = z
  .string()
  .min(1, "Vui lòng nhập tên đăng nhập")
  .min(3, "Tên đăng nhập từ 3–30 ký tự")
  .max(30, "Tên đăng nhập từ 3–30 ký tự")
  .regex(/^[a-zA-Z0-9._]+$/, "Chỉ dùng chữ, số, dấu chấm hoặc gạch dưới")
  .trim();

// Số điện thoại VN: 10–11 số, bắt đầu 0 hoặc +84
const phoneSchema = z
  .string()
  .min(1, "Vui lòng nhập số điện thoại")
  .transform((s) => s.replace(/\s/g, ""))
  .refine((s) => /^(0|\+84)?[0-9]{9,10}$/.test(s), "Số điện thoại không đúng định dạng");

// Login
export const loginSchema = z.object({
  username: usernameSchema,
  password: z
    .string()
    .min(1, "Vui lòng nhập mật khẩu")
    .min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Register
export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .optional()
      .refine((v) => !v || v.length === 0 || (v.length >= 2 && v.length <= 50 && /^[\p{L}\s]+$/u.test(v)), {
        message: "Họ tên từ 2–50 ký tự, chỉ chữ và khoảng trắng",
      }),

    username: usernameSchema,

    email: z
      .string()
      .min(1, "Vui lòng nhập email")
      .email("Email không đúng định dạng")
      .max(100, "Email quá dài")
      .toLowerCase()
      .trim(),

    phoneNumber: phoneSchema,

    password: z
      .string()
      .min(1, "Vui lòng nhập mật khẩu")
      .min(6, "Mật khẩu tối thiểu 6 ký tự")
      .max(100, "Mật khẩu quá dài"),

    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
