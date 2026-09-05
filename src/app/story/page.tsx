import type { Metadata } from "next";
import Link from "next/link";
import { IconArrowRight, IconPlant, IconShieldLock, IconCpu, IconInfinity } from "@tabler/icons-react";

export const metadata: Metadata = {
  title: "Câu chuyện thương hiệu | Eco Market",
  description:
    "Tìm hiểu hành trình hình thành và phát triển của Eco Market từ lý tưởng sống xanh đến nền tảng thương mại tuần hoàn công nghệ cao.",
};

const CHAPTERS = [
  {
    step: "Chương 01",
    year: "2023",
    title: "Trăn trở từ sự lãng phí thầm lặng",
    icon: IconPlant,
    summary:
      "Hàng triệu thiết bị điện tử, nội thất và vật dụng cá nhân vẫn còn hoạt động hoàn hảo nhưng bị lãng quên hoặc thải bỏ mỗi năm chỉ vì thiếu một kênh trao đổi đủ an toàn và thẩm mỹ.",
    detail:
      "Tại Việt Nam, thị trường đồ cũ từng đối mặt với nhiều rào cản: nỗi lo hàng giả, tâm lý e ngại lừa đảo khi chuyển khoản trước, và giao diện mua bán lộn xộn. Eco Market được ấp ủ từ niềm tin rằng: đồ đã qua sử dụng xứng đáng có một vị thế trang trọng và một trải nghiệm mua bán xứng tầm.",
  },
  {
    step: "Chương 02",
    year: "2024",
    title: "Đặt nền móng cho Ký quỹ Escrow",
    icon: IconShieldLock,
    summary:
      "Giải quyết bài toán niềm tin bằng giải pháp công nghệ giữ tiền ký quỹ độc lập.",
    detail:
      "Chúng tôi xây dựng hệ thống thanh toán ký quỹ trung gian, nơi tiền của người mua được bảo vệ 100% cho đến khi người mua kiểm tra hàng tận tay và đồng ý nhận. Rủi ro gian lận bị triệt tiêu, mở ra một kỷ nguyên an tâm tuyệt đối trong giao dịch C2C.",
  },
  {
    step: "Chương 03",
    year: "2025",
    title: "Ứng dụng AI nâng tầm trải nghiệm",
    icon: IconCpu,
    summary:
      "Chuẩn hóa dữ liệu sản phẩm và tự động kiểm định chất lượng bằng trí tuệ nhân tạo.",
    detail:
      "Đội ngũ kỹ thuật phát triển hệ thống kiểm duyệt thị giác AI để phân tích ảnh sản phẩm, thẩm định tình trạng thực tế và sàng lọc tin đăng tức thì. Người mua tiếp cận thông tin trung thực, người bán tiết kiệm tối đa thời gian tạo bài viết.",
  },
  {
    step: "Chương 04",
    year: "Tương lai",
    title: "Hệ sinh thái tuần hoàn toàn diện",
    icon: IconInfinity,
    summary:
      "Mở rộng chuỗi giá trị tuần hoàn kết nối tái chế, sửa chữa và lưu thông bền vững.",
    detail:
      "Không dừng lại ở việc mua bán, Eco Market hướng tới xây dựng một hệ sinh thái tiêu dùng tuần hoàn hoàn chỉnh tại Đông Nam Á, nơi mỗi sản phẩm được trân trọng và lưu chuyển liên tục trong vòng đời hữu ích của nó.",
  },
];

export default function StoryPage() {
  return (
    <div className="min-h-screen bg-luxury-ivory text-luxury-ink">
      <section className="relative border-b border-luxury-ink/10 bg-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="h-px w-8 bg-luxury-champagne/80" />
            <span className="text-2xs font-bold uppercase tracking-[0.28em] text-neutral-600">
              Hành Trình Thương Hiệu
            </span>
            <span className="h-px w-8 bg-luxury-champagne/80" />
          </div>
          <h1 className="font-droid-serif text-3xl sm:text-5xl font-medium tracking-tight text-luxury-ink leading-tight">
            Khởi Nguồn Từ Lý Tưởng Sống Xanh & Công Nghệ
          </h1>
          <p className="mt-6 text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Câu chuyện về cách chúng tôi biến việc mua bán đồ cũ trở thành một thói quen tiêu dùng văn minh, đẳng cấp và giàu trách nhiệm với tương lai.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {CHAPTERS.map((ch, idx) => {
            const Icon = ch.icon;
            return (
              <div
                key={idx}
                className="rounded-[2px] border border-luxury-ink/10 bg-white p-6 sm:p-10 relative overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-luxury-ink/8 pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[2px] border border-luxury-ink/10 bg-cream-50 text-luxury-ink flex items-center justify-center">
                      <Icon className="w-5 h-5" stroke={1.5} />
                    </div>
                    <div>
                      <span className="text-2xs font-bold uppercase tracking-[0.2em] text-neutral-500 block">
                        {ch.step}
                      </span>
                      <h2 className="font-droid-serif text-xl sm:text-2xl font-bold text-luxury-ink">
                        {ch.title}
                      </h2>
                    </div>
                  </div>
                  <span className="font-droid-serif text-lg font-bold text-luxury-champagne self-start sm:self-auto">
                    {ch.year}
                  </span>
                </div>

                <div className="space-y-4">
                  <p className="text-xs sm:text-sm font-semibold text-luxury-ink leading-relaxed">
                    {ch.summary}
                  </p>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    {ch.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-t border-luxury-ink/10 bg-luxury-ink text-luxury-ivory py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-droid-serif text-2xl sm:text-3xl font-bold">
            Trở Thành Một Phần Của Câu Chuyện Eco Market
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
            Mỗi lựa chọn mua sắm hay đăng bán của bạn là một bước tiến nhỏ hướng tới nền kinh tế không rác thải.
          </p>
          <div className="pt-2">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 rounded-[2px] bg-luxury-ivory text-luxury-ink px-6 py-3 text-2xs font-bold uppercase tracking-[0.14em] hover:bg-cream-100 transition-all"
            >
              Bắt đầu trải nghiệm ngay
              <IconArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
