import { z } from "zod";

export const becomeSellerSchema = z.object({
  address: z
    .string()
    .min(5, "Địa chỉ kinh doanh phải có ít nhất 5 ký tự")
    .max(200, "Địa chỉ không được quá 200 ký tự")
    .trim(),
  provinceId: z.string().min(1, "Vui lòng chọn Tỉnh/Thành phố"),
  districtId: z.string().min(1, "Vui lòng chọn Quận/Huyện"),
  wardCode: z.string().min(1, "Vui lòng chọn Phường/Xã"),
  province: z.string().min(1),
  district: z.string().min(1),
  ward: z.string().min(1),
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
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "Bạn cần đồng ý điều khoản sử dụng",
  }),
  agreePolicy: z.boolean().refine((val) => val === true, {
    message: "Bạn cần đồng ý chính sách bảo mật",
  }),
});

export type BecomeSellerInput = z.infer<typeof becomeSellerSchema>;
