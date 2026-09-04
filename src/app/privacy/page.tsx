import type { Metadata } from "next";
import Link from "next/link";
import { IconShieldLock, IconDatabase, IconLock, IconUserCheck } from "@tabler/icons-react";

export const metadata: Metadata = {
  title: "Chính sách bảo mật | Eco Market",
  description:
    "Cam kết thu thập, xử lý, bảo vệ và lưu trữ thông tin cá nhân của người dùng tại Eco Market tuân thủ quy định pháp luật hiện hành.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-luxury-ivory text-luxury-ink">
      <section className="relative border-b border-luxury-ink/10 bg-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="h-px w-8 bg-luxury-champagne/80" />
            <span className="text-2xs font-bold uppercase tracking-[0.28em] text-neutral-600">
              Quyền Riêng Tư & Dữ Liệu
            </span>
            <span className="h-px w-8 bg-luxury-champagne/80" />
          </div>
          <h1 className="font-droid-serif text-3xl sm:text-5xl font-bold tracking-tight text-luxury-ink leading-tight">
            Chính Sách Bảo Mật Thông Tin
          </h1>
          <p className="mt-4 text-xs sm:text-sm text-neutral-500">
            Cập nhật lần cuối: Ngày 01 tháng 01 năm 2026 · Tuân thủ Nghị định 13/2023/NĐ-CP
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2px] border border-luxury-ink/10 bg-white p-6 sm:p-12 space-y-10 leading-relaxed text-xs sm:text-sm text-neutral-700">
          <div className="space-y-3">
            <h2 className="font-droid-serif text-lg sm:text-xl font-bold text-luxury-ink flex items-center gap-2 border-b border-luxury-ink/8 pb-2">
              1. Mục đích thu thập dữ liệu cá nhân
            </h2>
            <p>
              Eco Market chỉ thu thập các thông tin cần thiết nhằm phục vụ các mục đích hợp pháp sau:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Xác thực danh tính người dùng và mở tài khoản mua bán trên sàn.</li>
              <li>Xử lý các giao dịch đặt hàng, vận chuyển GHN và thanh toán ký quỹ qua VietQR / PayOS.</li>
              <li>Xác thực định danh người bán (KYC) để ngăn ngừa gian lận thương mại điện tử.</li>
              <li>Gửi thông báo cập nhật trạng thái đơn hàng, tin nhắn hệ thống và hỗ trợ khách hàng khi có khiếu nại.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="font-droid-serif text-lg sm:text-xl font-bold text-luxury-ink flex items-center gap-2 border-b border-luxury-ink/8 pb-2">
              2. Phạm vi thông tin được thu thập
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Thông tin cơ bản:</strong> Họ tên, địa chỉ email, số điện thoại, ảnh đại diện, địa chỉ nhận hàng.
              </li>
              <li>
                <strong>Thông tin định danh người bán:</strong> Ảnh chụp thẻ CCCD/CMND 2 mặt (được mã hóa lưu trữ), số tài khoản ngân hàng và tên chủ thẻ thụ hưởng.
              </li>
              <li>
                <strong>Thông tin kỹ thuật:</strong> Địa chỉ IP, loại thiết bị, lịch sử thao tác hệ thống (Audit logs) nhằm phục vụ công tác an ninh mạng.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="font-droid-serif text-lg sm:text-xl font-bold text-luxury-ink flex items-center gap-2 border-b border-luxury-ink/8 pb-2">
              3. Chia sẻ thông tin với bên thứ ba
            </h2>
            <p>
              Chúng tôi cam kết <strong>KHÔNG</strong> bán, trao đổi hoặc chia sẻ dữ liệu cá nhân của bạn cho bên thứ ba vì mục đích quảng cáo khi chưa có sự đồng ý của bạn, ngoại trừ các đơn vị đối tác trực tiếp trong chu trình phục vụ đơn hàng:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Đơn vị vận chuyển (GHN Express):</strong> Nhận thông tin họ tên, số điện thoại và địa chỉ giao nhận để thực hiện phát hàng.
              </li>
              <li>
                <strong>Cổng thanh toán (PayOS / VietQR):</strong> Xử lý dữ liệu giao dịch tài chính an toàn theo tiêu chuẩn bảo mật PCI DSS.
              </li>
              <li>
                <strong>Cơ quan pháp luật:</strong> Cung cấp thông tin khi có yêu cầu bằng văn bản hợp pháp từ cơ quan điều tra có thẩm quyền tại Việt Nam.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="font-droid-serif text-lg sm:text-xl font-bold text-luxury-ink flex items-center gap-2 border-b border-luxury-ink/8 pb-2">
              4. Biện pháp an toàn & Bảo mật dữ liệu
            </h2>
            <p>
              Hệ thống Eco Market áp dụng các công nghệ bảo mật tiên tiến nhất:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Mã hóa dữ liệu đường truyền với chứng chỉ SSL/TLS 256-bit chuẩn quốc tế.</li>
              <li>Mật khẩu người dùng được băm (hash) bằng thuật toán mã hóa một chiều an toàn (Bcrypt / Argon2).</li>
              <li>Hệ thống máy chủ phân tán có tường lửa đa tầng ngăn chặn tấn công DDoS và xâm nhập trái phép.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="font-droid-serif text-lg sm:text-xl font-bold text-luxury-ink flex items-center gap-2 border-b border-luxury-ink/8 pb-2">
              5. Quyền của chủ thể dữ liệu
            </h2>
            <p>
              Bạn có đầy đủ quyền xem, chỉnh sửa thông tin cá nhân trong trang Quản lý hồ sơ (Profile), yêu cầu trích xuất dữ liệu hoặc yêu cầu xóa vĩnh viễn tài khoản và dữ liệu liên quan khi không còn nhu cầu sử dụng bằng cách gửi yêu cầu tới đội ngũ hỗ trợ.
            </p>
          </div>

          <div className="pt-6 border-t border-luxury-ink/8 text-xs text-neutral-500 flex flex-col sm:flex-row justify-between gap-4">
            <span>Bạn có câu hỏi về quyền riêng tư?</span>
            <Link href="/contact" className="font-semibold text-accent hover:underline">
              Gửi yêu cầu bảo mật dữ liệu →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
