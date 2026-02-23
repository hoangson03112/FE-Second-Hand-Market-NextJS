import { z } from "zod";

export const becomeSellerSchema = z.object({
  bankName: z
    .string()
    .min(2, "Tên ngân hàng phải có ít nhất 2 ký tự")
    .max(100)
    .trim(),
  accountNumber: z
    .string()
    .min(8, "Số tài khoản phải có ít nhất 8 số")
    .max(20, "Số tài khoản không hợp lệ")
    .regex(/^[0-9]+$/, "Số tài khoản chỉ chứa chữ số")
    .trim(),
  accountHolder: z
    .string()
    .min(2, "Tên chủ tài khoản phải có ít nhất 2 ký tự")
    .max(100)
    .trim(),
  phoneNumber: z
    .string()
    .min(1, "Vui lòng nhập số điện thoại")
    .regex(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ (10-11 số)")
    .trim(),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "Bạn cần đồng ý điều khoản sử dụng",
  }),
  agreePolicy: z.boolean().refine((val) => val === true, {
    message: "Bạn cần đồng ý chính sách bảo mật",
  }),
});

export type BecomeSellerInput = z.infer<typeof becomeSellerSchema>;
