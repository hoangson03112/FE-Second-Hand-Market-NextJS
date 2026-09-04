import type { Metadata } from "next";
import Link from "next/link";
import { IconShieldCheck, IconFileText, IconScale } from "@tabler/icons-react";

export const metadata: Metadata = {
  title: "Điều khoản sử dụng | Eco Market",
  description:
    "Quy chế và điều khoản dịch vụ ràng buộc quyền và nghĩa vụ của người dùng khi tham gia giao dịch trên sàn thương mại điện tử Eco Market.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-luxury-ivory text-luxury-ink">
      <section className="relative border-b border-luxury-ink/10 bg-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="h-px w-8 bg-luxury-champagne/80" />
            <span className="text-2xs font-bold uppercase tracking-[0.28em] text-neutral-600">
              Văn Bản Pháp Lý
            </span>
            <span className="h-px w-8 bg-luxury-champagne/80" />
          </div>
          <h1 className="font-droid-serif text-3xl sm:text-5xl font-bold tracking-tight text-luxury-ink leading-tight">
            Điều Khoản Sử Dụng Dịch Vụ
          </h1>
          <p className="mt-4 text-xs sm:text-sm text-neutral-500">
            Cập nhật lần cuối: Ngày 01 tháng 01 năm 2026 · Phiên bản 2.4
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2px] border border-luxury-ink/10 bg-white p-6 sm:p-12 space-y-10 leading-relaxed text-xs sm:text-sm text-neutral-700">
          <div className="space-y-3">
            <h2 className="font-droid-serif text-lg sm:text-xl font-bold text-luxury-ink flex items-center gap-2 border-b border-luxury-ink/8 pb-2">
              1. Giới thiệu chung & Chấp thuận điều khoản
            </h2>
            <p>
              Chào mừng bạn đến với sàn thương mại điện tử <strong>Eco Market</strong> (thuộc quyền sở hữu và vận hành bởi Công ty Cổ phần Eco Market Việt Nam). Bằng việc đăng ký tài khoản, truy cập hoặc thực hiện bất kỳ giao dịch nào trên nền tảng, bạn xác nhận đã đọc kỹ, hiểu rõ và đồng ý bị ràng buộc bởi toàn bộ các điều khoản và điều kiện được nêu tại đây.
            </p>
            <p>
              Nếu bạn không đồng ý với bất kỳ phần nào của Điều khoản này, vui lòng ngừng sử dụng dịch vụ của Eco Market ngay lập tức.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-droid-serif text-lg sm:text-xl font-bold text-luxury-ink flex items-center gap-2 border-b border-luxury-ink/8 pb-2">
              2. Đăng ký & Bảo mật tài khoản
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Điều kiện độ tuổi:</strong> Bạn phải từ đủ 15 tuổi trở lên và có đầy đủ năng lực hành vi dân sự theo quy định của pháp luật Việt Nam để tạo tài khoản mua sắm.
              </li>
              <li>
                <strong>Tính chính xác của thông tin:</strong> Người dùng cam kết cung cấp thông tin cá nhân (họ tên, email, số điện thoại, địa chỉ) trung thực và cập nhật liên tục.
              </li>
              <li>
                <strong>Trách nhiệm bảo mật:</strong> Bạn chịu trách nhiệm hoàn toàn về việc bảo mật mật khẩu và mọi hoạt động phát sinh từ tài khoản của mình. Vui lòng thông báo ngay cho Eco Market nếu nghi ngờ tài khoản bị truy cập trái phép.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="font-droid-serif text-lg sm:text-xl font-bold text-luxury-ink flex items-center gap-2 border-b border-luxury-ink/8 pb-2">
              3. Cơ chế Ký quỹ Escrow & Giao dịch an toàn
            </h2>
            <p>
              Để bảo vệ tuyệt đối quyền lợi của các bên, Eco Market áp dụng cơ chế giữ tiền ký quỹ trung gian:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Tiền thanh toán của người mua được chuyển vào tài khoản đảm bảo an toàn do Eco Market quản lý ngay sau khi đặt hàng thành công.
              </li>
              <li>
                Người bán chỉ được giải ngân số tiền bán hàng khi người mua đã nhận hàng, kiểm tra và xác nhận hài lòng hoặc sau khi kết thúc thời hạn khiếu nại (3 ngày) mà không có tranh chấp phát sinh.
              </li>
              <li>
                Nghiêm cấm các hình thức thỏa thuận chuyển khoản ngoài hệ thống nhằm mục đích lách phí hoặc lừa đảo. Eco Market từ chối bảo hộ mọi giao dịch nằm ngoài hệ sinh thái chính thức.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="font-droid-serif text-lg sm:text-xl font-bold text-luxury-ink flex items-center gap-2 border-b border-luxury-ink/8 pb-2">
              4. Quy định đối với Người bán (Seller)
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Định danh bắt buộc:</strong> Người bán phải hoàn thành xác thực CCCD 2 mặt và tài khoản ngân hàng thụ hưởng chính chủ trước khi được cấp quyền đăng bài.
              </li>
              <li>
                <strong>Trung thực về sản phẩm:</strong> Sản phẩm đăng bán phải có ảnh chụp thực tế, mô tả chính xác khuyết tật/tình trạng sử dụng và nguồn gốc xuất xứ. Nghiêm cấm sử dụng ảnh mạng giả mạo.
              </li>
              <li>
                <strong>Hàng hóa cấm giao dịch:</strong> Nghiêm cấm tuyệt đối hàng giả, hàng nhái thương hiệu, vũ khí, chất cấm, động vật hoang dã và các hàng hóa bị pháp luật cấm lưu hành.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="font-droid-serif text-lg sm:text-xl font-bold text-luxury-ink flex items-center gap-2 border-b border-luxury-ink/8 pb-2">
              5. Quyền sở hữu trí tuệ & Giới hạn trách nhiệm
            </h2>
            <p>
              Toàn bộ nhãn hiệu, logo, giao diện thiết kế, mã nguồn và nội dung bài viết trên Eco Market thuộc quyền sở hữu trí tuệ của Eco Market hoặc các đối tác cấp phép. Mọi hành vi sao chép, trích xuất dữ liệu tự động (scraping) khi chưa có văn bản đồng ý đều là vi phạm pháp luật.
            </p>
            <p>
              Eco Market đóng vai trò là sàn giao dịch trung gian công nghệ và cam kết nỗ lực tối đa để bảo vệ sự an toàn của các bên, tuy nhiên chúng tôi không trực tiếp chịu trách nhiệm về chất lượng sản phẩm nguyên bản của người bán ngoài phạm vi chính sách bảo vệ ký quỹ đã công bố.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-droid-serif text-lg sm:text-xl font-bold text-luxury-ink flex items-center gap-2 border-b border-luxury-ink/8 pb-2">
              6. Giải quyết tranh chấp & Luật điều chỉnh
            </h2>
            <p>
              Các điều khoản này được điều chỉnh và giải thích theo quy định của pháp luật nước Cộng hòa Xã hội Chủ nghĩa Việt Nam. Mọi tranh chấp phát sinh sẽ được ưu tiên thương lượng hòa giải tại Eco Market; nếu không đạt được thỏa thuận sẽ đưa ra Tòa án có thẩm quyền tại TP. Hồ Chí Minh để phân xử.
            </p>
          </div>

          <div className="pt-6 border-t border-luxury-ink/8 text-xs text-neutral-500 flex flex-col sm:flex-row justify-between gap-4">
            <span>Có thắc mắc về điều khoản?</span>
            <Link href="/contact" className="font-semibold text-accent hover:underline">
              Liên hệ bộ phận Pháp chế Eco Market →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
