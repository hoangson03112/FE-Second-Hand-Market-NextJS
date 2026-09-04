"use client";

import { useState } from "react";
import Link from "next/link";
import {
  IconChevronDown,
  IconChevronUp,
  IconHelpCircle,
  IconSearch,
  IconShoppingCart,
  IconBuildingStore,
  IconShieldCheck,
  IconTruck,
  IconReceiptRefund,
} from "@tabler/icons-react";

type FAQCategory = "all" | "buyer" | "seller" | "escrow" | "shipping" | "return";

const CATEGORIES: { key: FAQCategory; label: string; icon: React.ElementType }[] = [
  { key: "all", label: "Tất cả câu hỏi", icon: IconHelpCircle },
  { key: "buyer", label: "Người mua", icon: IconShoppingCart },
  { key: "seller", label: "Người bán", icon: IconBuildingStore },
  { key: "escrow", label: "Ký quỹ & Thanh toán", icon: IconShieldCheck },
  { key: "shipping", label: "Vận chuyển", icon: IconTruck },
  { key: "return", label: "Đổi trả & Hoàn tiền", icon: IconReceiptRefund },
];

const FAQS = [
  {
    category: "buyer",
    q: "Làm thế nào để mua hàng an toàn trên Eco Market?",
    a: "Mọi giao dịch thanh toán trực tuyến trên Eco Market đều được tự động chuyển vào tài khoản ký quỹ trung gian (Escrow). Người bán sẽ KHÔNG nhận được tiền cho đến khi bạn nhận được hàng, kiểm tra thực tế và xác nhận 'Đã nhận hàng và hài lòng'.",
  },
  {
    category: "buyer",
    q: "Tôi có được kiểm tra hàng trước khi nhận không?",
    a: "Có! Eco Market áp dụng chính sách đồng kiểm cùng nhân viên giao hàng GHN Express. Bạn có quyền mở hộp kiểm tra ngoại quan sản phẩm trước khi nhận hàng. Nếu phát hiện sai sót hoặc hư hỏng nặng, bạn có quyền từ chối nhận hàng ngay tại chỗ.",
  },
  {
    category: "buyer",
    q: "Nếu sản phẩm bị lỗi ẩn sau khi nhận thì xử lý thế nào?",
    a: "Bạn có 3 ngày (72 giờ) kể từ khi ký nhận hàng để bấm nút 'Yêu cầu hoàn tiền' trong trang chi tiết đơn hàng nếu phát hiện sản phẩm không đúng như mô tả của người bán. Tiền trong tài khoản ký quỹ sẽ lập tức bị đóng băng để chờ Admin thẩm định.",
  },
  {
    category: "seller",
    q: "Điều kiện để trở thành người bán (Seller) trên Eco Market là gì?",
    a: "Để bảo vệ cộng đồng mua sắm văn minh, người bán cần thực hiện xác thực định danh (KYC) bằng ảnh chụp CCCD 2 mặt và cung cấp thông tin tài khoản ngân hàng chính chủ. Ban quản trị sẽ xét duyệt hồ sơ trong vòng 2 - 4 giờ làm việc.",
  },
  {
    category: "seller",
    q: "Khi nào tôi nhận được tiền bán hàng vào tài khoản?",
    a: "Sau khi người mua bấm 'Đã nhận hàng' (hoặc sau 3 ngày kể từ khi đơn hàng giao thành công mà người mua không có khiếu nại), số tiền bán hàng (sau khi trừ phí sàn minh bạch) sẽ được giải ngân tự động về tài khoản ngân hàng bạn đã đăng ký.",
  },
  {
    category: "seller",
    q: "Phí dịch vụ của Eco Market được tính như thế nào?",
    a: "Eco Market chỉ thu một mức phí hoa hồng cố định rất nhỏ (5%) trên mỗi đơn hàng giao dịch thành công để duy trì hạ tầng công nghệ, vận hành ký quỹ và hỗ trợ logistics. Hoàn toàn không có phí mở gian hàng hay phí duy trì định kỳ.",
  },
  {
    category: "escrow",
    q: "Cơ chế Ký quỹ Escrow bảo vệ tiền của tôi như thế nào?",
    a: "Khi bạn thanh toán qua cổng VietQR / PayOS, tiền được chuyển vào tài khoản đảm bảo an toàn do Eco Market bảo chứng. Cả người mua và người bán đều không thể tự ý rút số tiền này cho đến khi giao dịch hoàn tất hợp lệ.",
  },
  {
    category: "escrow",
    q: "Eco Market hỗ trợ những phương thức thanh toán nào?",
    a: "Chúng tôi hỗ trợ chuyển khoản ngân hàng quét mã QR động tức thì (VietQR), thẻ ATM nội địa Napas và các ứng dụng ngân hàng di động phổ biến tại Việt Nam.",
  },
  {
    category: "shipping",
    q: "Đơn hàng của tôi được giao trong bao lâu?",
    a: "Thời gian giao hàng tiêu chuẩn qua GHN Express là 1-2 ngày đối với đơn nội tỉnh / nội thành, và 2-4 ngày đối với các tỉnh thành liên miền. Bạn có thể theo dõi vị trí kiện hàng trực tiếp trên hệ thống theo thời gian thực.",
  },
  {
    category: "return",
    q: "Quy trình giải quyết khiếu nại và hoàn tiền diễn ra ra sao?",
    a: "Khi người mua gửi yêu cầu hoàn tiền kèm hình ảnh/video bằng chứng, người bán có 24h để phản hồi. Nếu hai bên không đạt được thỏa thuận, đội ngũ Admin Eco Market sẽ đứng ra làm trọng tài phán quyết căn cứ theo bằng chứng thực tế và lịch sử trò chuyện trên sàn.",
  },
  {
    category: "return",
    q: "Tiền hoàn lại sẽ được gửi về đâu?",
    a: "Khi khiếu nại được duyệt chấp thuận, hệ thống sẽ tự động chuyển khoản tiền hoàn 100% về tài khoản ngân hàng do người mua cung cấp trong vòng 1-2 giờ làm việc.",
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<FAQCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const filteredFaqs = FAQS.filter((faq) => {
    const matchCat = activeCategory === "all" || faq.category === activeCategory;
    const matchSearch =
      !searchQuery.trim() ||
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const toggleAccordion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-luxury-ivory text-luxury-ink">
      <section className="relative border-b border-luxury-ink/10 bg-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="h-px w-8 bg-luxury-champagne/80" />
            <span className="text-2xs font-bold uppercase tracking-[0.28em] text-neutral-600">
              Giải Đáp Thắc Mắc
            </span>
            <span className="h-px w-8 bg-luxury-champagne/80" />
          </div>
          <h1 className="font-droid-serif text-3xl sm:text-5xl font-bold tracking-tight text-luxury-ink leading-tight">
            Câu Hỏi Thường Gặp (FAQ)
          </h1>
          <p className="mt-4 text-sm sm:text-base text-neutral-600 max-w-xl mx-auto leading-relaxed">
            Tổng hợp đầy đủ các câu hỏi và giải đáp chi tiết nhất về quy chế hoạt động, giao dịch và quyền lợi tại Eco Market.
          </p>

          <div className="mt-8 max-w-xl mx-auto relative">
            <div className="flex items-center rounded-[2px] border border-luxury-ink/20 bg-cream-50/50 px-4 py-3 shadow-xs">
              <IconSearch className="w-5 h-5 text-neutral-400 shrink-0 mr-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm nhanh câu hỏi..."
                className="w-full bg-transparent text-xs sm:text-sm text-luxury-ink placeholder:text-neutral-400 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.key;
            const Icon = cat.icon;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`inline-flex items-center gap-2 rounded-[2px] px-4 py-2 text-2xs font-bold uppercase tracking-[0.12em] whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-luxury-ink text-luxury-ivory"
                    : "bg-white border border-luxury-ink/10 text-neutral-600 hover:bg-taupe-50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-16 rounded-[2px] border border-dashed border-luxury-ink/15 bg-white p-8">
              <p className="text-sm font-semibold text-luxury-ink">
                Không tìm thấy câu hỏi phù hợp
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                Thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác.
              </p>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const isOpen = expandedIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-[2px] border border-luxury-ink/10 bg-white transition-all overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(index)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-taupe-50/40 transition-colors"
                  >
                    <span className="font-droid-serif text-sm sm:text-base font-bold text-luxury-ink">
                      {faq.q}
                    </span>
                    <span className="w-8 h-8 rounded-[2px] border border-luxury-ink/10 bg-cream-50 flex items-center justify-center shrink-0 text-luxury-ink">
                      {isOpen ? (
                        <IconChevronUp className="w-4 h-4" />
                      ) : (
                        <IconChevronDown className="w-4 h-4" />
                      )}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-luxury-ink/6 bg-cream-50/20">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="mt-12 rounded-[2px] border border-luxury-ink/10 bg-white p-8 text-center space-y-3">
          <h3 className="font-droid-serif text-lg font-bold text-luxury-ink">
            Vẫn còn câu hỏi chưa được giải đáp?
          </h3>
          <p className="text-xs text-neutral-600 max-w-md mx-auto">
            Đội ngũ chuyên viên Eco Market luôn sẵn sàng hỗ trợ bạn bất kỳ lúc nào.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-[2px] bg-luxury-ink px-6 py-2.5 text-2xs font-bold uppercase tracking-[0.14em] text-luxury-ivory hover:bg-charcoal-800 transition-all"
            >
              Liên hệ chúng tôi ngay
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
