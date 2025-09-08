"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import useMounted from "@/hooks/useMounted";
// Using simple icons since Heroicons might not be installed
const ChevronUpIcon = ({ className }: { className: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 15l7-7 7 7"
    />
  </svg>
);

const PlusIcon = ({ className }: { className: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
    />
  </svg>
);

const MagnifyingGlassIcon = ({ className }: { className: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
    />
  </svg>
);

const ShieldCheckIcon = ({ className }: { className: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
);

const BoltIcon = ({ className }: { className: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  </svg>
);

const HeartIcon = ({ className }: { className: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);

const ChatBubbleLeftRightIcon = ({ className }: { className: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
);

const CheckCircleIcon = ({ className }: { className: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const StarIcon = ({ className }: { className: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
    />
  </svg>
);

// Stats data
const statsData = [
  {
    icon: "📦",
    number: "50K+",
    label: "Sản phẩm",
    description: "Đã được niêm yết",
  },
  {
    icon: "👥",
    number: "10K+",
    label: "Người dùng",
    description: "Hoạt động hàng tháng",
  },
  {
    icon: "♻️",
    number: "95%",
    label: "Tái sử dụng",
    description: "Tỷ lệ thành công",
  },
  {
    icon: "⭐",
    number: "4.8/5",
    label: "Đánh giá",
    description: "Từ cộng đồng",
  },
];

const Home = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const isMounted = useMounted();

  useEffect(() => {
    if (!isMounted) return;

    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [isMounted]);

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const featuresData = [
    {
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      title: "An toàn & Bảo mật",
      description: "Giao dịch được bảo vệ với công nghệ mã hóa hiện đại",
      color: "green",
    },
    {
      icon: <BoltIcon className="w-8 h-8" />,
      title: "Nhanh chóng",
      description: "Đăng tin và tìm kiếm sản phẩm chỉ trong vài phút",
      color: "blue",
    },
    {
      icon: <HeartIcon className="w-8 h-8" />,
      title: "Thân thiện môi trường",
      description: "Góp phần bảo vệ môi trường bằng việc tái sử dụng",
      color: "green",
    },
    {
      icon: <ChatBubbleLeftRightIcon className="w-8 h-8" />,
      title: "Hỗ trợ 24/7",
      description: "Đội ngũ hỗ trợ luôn sẵn sàng giúp đỡ bạn",
      color: "purple",
    },
  ];

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section
        className="min-h-screen flex items-center relative overflow-hidden rounded-b-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.15)]"
        style={{
          background: `
             linear-gradient(135deg, rgba(249,250,251,1) 0%, rgba(229,231,235,0.95) 30%, rgba(156,163,175,0.1) 70%, rgba(75,85,99,0.05) 100%),
             radial-gradient(ellipse at 80% 20%, rgba(31,41,55,0.08) 0%, transparent 50%),
             radial-gradient(ellipse at 20% 80%, rgba(55,65,81,0.06) 0%, transparent 60%),
             linear-gradient(45deg, rgba(209,213,219,0.4) 0%, transparent 30%, rgba(156,163,175,0.3) 70%, transparent 100%)
           `,
          backgroundSize: "100% 100%, 1200px 1200px, 800px 800px, 400px 400px",
          animation: "gradientShift 20s ease infinite",
        }}
      >
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-1 h-1 bg-slate-300/40 rounded-full animate-float-slow"></div>
          <div
            className="absolute top-40 right-32 w-2 h-2 bg-slate-400/30 rounded-full animate-float-medium"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute bottom-32 left-16 w-1.5 h-1.5 bg-slate-300/50 rounded-full animate-float-fast"
            style={{ animationDelay: "4s" }}
          ></div>
          <div
            className="absolute top-60 left-1/3 w-0.5 h-0.5 bg-slate-400/60 rounded-full animate-float-slow"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-20 right-20 w-1 h-1 bg-slate-300/40 rounded-full animate-float-medium"
            style={{ animationDelay: "3s" }}
          ></div>
          <div
            className="absolute top-32 right-1/4 w-1.5 h-1.5 bg-slate-400/35 rounded-full animate-float-fast"
            style={{ animationDelay: "5s" }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fadeIn">
              {/* Badge */}
              <div className="inline-flex items-center px-5 py-3 bg-white/90 backdrop-blur-xl text-slate-700 rounded-full text-sm font-semibold border border-white/60 shadow-xl shadow-black/10 hover:shadow-2xl hover:scale-105 transition-all duration-500 group cursor-pointer">
                <span className="w-2 h-2 bg-gradient-to-r from-slate-400 to-slate-500 rounded-full mr-3 group-hover:animate-pulse"></span>
                <span className="bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                  Nền tảng mua bán tinh tế
                </span>
              </div>

              {/* Title */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extralight text-slate-900 leading-[0.8] tracking-[-0.03em] hover:tracking-[-0.04em] transition-all duration-700">
                <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent hover:from-slate-800 hover:via-slate-900 hover:to-slate-800 transition-all duration-1000">
                  Chợ Đồ Cũ
                </span>
                <br />
                <span className="font-thin text-slate-600 italic text-4xl md:text-5xl lg:text-6xl hover:text-slate-500 transition-colors duration-500">
                  Thông Minh
                </span>
              </h1>

              {/* Description */}
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-lg font-light tracking-wide hover:text-slate-700 transition-colors duration-500">
                Kết nối những tâm hồn yêu thích sự tinh tế,
                <br className="hidden md:block" />
                tạo ra{" "}
                <em className="text-slate-800 not-italic font-medium bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text text-transparent hover:from-slate-700 hover:to-slate-800 transition-all duration-500">
                  giá trị bền vững
                </em>
                <br className="hidden md:block" />
                cho cuộc sống hiện đại.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/eco-market/product-list"
                  className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white font-semibold rounded-xl hover:from-slate-800 hover:to-slate-700 transition-all duration-500 shadow-2xl shadow-slate-900/25 hover:shadow-3xl hover:shadow-slate-900/40 hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <MagnifyingGlassIcon className="w-5 h-5 mr-3 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                  <span className="relative z-10">Khám phá bộ sưu tập</span>
                </Link>
                <Link
                  href="/eco-market/post-product"
                  className="group relative inline-flex items-center justify-center px-8 py-4 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:border-slate-500 hover:bg-slate-50/80 backdrop-blur-sm transition-all duration-500 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-black/10 hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <PlusIcon className="w-5 h-5 mr-3 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                  <span className="relative z-10">Chia sẻ kho báu</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-8 pt-12 border-t border-slate-200/50">
                <div className="text-center group">
                  <div className="text-2xl font-light text-slate-900 mb-1">
                    10K+
                  </div>
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Sản phẩm tinh túy
                  </div>
                </div>
                <div className="text-center group">
                  <div className="text-2xl font-light text-slate-900 mb-1">
                    5K+
                  </div>
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Thành viên
                  </div>
                </div>
                <div className="text-center group">
                  <div className="text-2xl font-light text-slate-900 mb-1">
                    4.8★
                  </div>
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Đánh giá
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Elegant Visual */}
            <div className="relative">
              {/* Floating elements */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-20 right-20 w-2 h-2 bg-slate-300 rounded-full animate-pulse"></div>
                <div
                  className="absolute top-40 right-32 w-1 h-1 bg-slate-400 rounded-full animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>
                <div
                  className="absolute bottom-32 right-16 w-1.5 h-1.5 bg-slate-300 rounded-full animate-pulse"
                  style={{ animationDelay: "2s" }}
                ></div>
              </div>

              {/* Main Content */}
              <div className="relative glass-enhanced p-12 rounded-3xl shadow-2xl shadow-black/10 hover:shadow-3xl hover:shadow-black/15 transition-all duration-700 hover:scale-105 group">
                <div className="text-center space-y-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto border border-slate-200/50">
                    <HeartIcon className="w-8 h-8 text-slate-600" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-light text-slate-900 tracking-wide">
                      Thân thiện môi trường
                    </h3>
                    <p className="text-slate-600 leading-relaxed font-light max-w-sm mx-auto">
                      Góp phần tạo nên một thế giới bền vững, nơi mỗi vật phẩm
                      đều có giá trị riêng biệt
                    </p>
                  </div>
                </div>
              </div>

              {/* Subtle Features */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-white/30 backdrop-blur-xl p-6 rounded-xl border border-white/20 text-center">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200/50">
                    <ShieldCheckIcon className="w-5 h-5 text-slate-600" />
                  </div>
                  <h4 className="font-medium text-slate-900 mb-2 text-sm">
                    Bảo mật tuyệt đối
                  </h4>
                  <p className="text-slate-600 text-xs font-light">
                    Giao dịch an toàn
                  </p>
                </div>
                <div className="bg-white/30 backdrop-blur-xl p-6 rounded-xl border border-white/20 text-center">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200/50">
                    <ChatBubbleLeftRightIcon className="w-5 h-5 text-slate-600" />
                  </div>
                  <h4 className="font-medium text-slate-900 mb-2 text-sm">
                    Hỗ trợ tận tâm
                  </h4>
                  <p className="text-slate-600 text-xs font-light">
                    Phục vụ 24/7
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Collections */}
          <div className="mt-32">
            <div className="text-center mb-20">
              <h2 className="text-3xl font-light text-slate-900 mb-6 tracking-wide">
                Bộ sưu tập tinh tế
              </h2>
              <div className="w-20 h-px bg-slate-300 mx-auto mb-8"></div>
              <p className="text-slate-600 font-light max-w-md mx-auto">
                Khám phá những danh mục được tuyển chọn kỹ lưỡng
              </p>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-8">
              {[
                { name: "Điện tử", icon: "📱" },
                { name: "Thời trang", icon: "👕" },
                { name: "Nội thất", icon: "🪑" },
                { name: "Sách", icon: "📚" },
                { name: "Xe cộ", icon: "🚗" },
                { name: "Khác", icon: "🎯" },
              ].map((category, index) => (
                <div
                  key={index}
                  className="group text-center cursor-pointer transition-all duration-700 hover:scale-110"
                >
                  <div className="w-16 h-16 bg-white/50 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20 shadow-lg shadow-black/5 group-hover:shadow-xl group-hover:shadow-black/10 transition-all duration-500">
                    <span className="text-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                      {category.icon}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors duration-300 tracking-wide">
                    {category.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Cách thức hoạt động
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chỉ với 3 bước đơn giản, bạn có thể mua bán đồ cũ một cách dễ dàng
              và an toàn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Đăng ký tài khoản",
                description:
                  "Tạo tài khoản miễn phí và xác thực thông tin của bạn",
                icon: "👤",
                color: "blue",
              },
              {
                step: "02",
                title: "Đăng tin/Tìm kiếm",
                description:
                  "Đăng tin bán hoặc tìm kiếm sản phẩm yêu thích của bạn",
                icon: "📝",
                color: "green",
              },
              {
                step: "03",
                title: "Giao dịch an toàn",
                description:
                  "Liên hệ và thực hiện giao dịch được bảo mật hoàn toàn",
                icon: "🤝",
                color: "purple",
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-100 hover:border-blue-500 hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 h-full">
                  {/* Step Number */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${
                        item.color === "blue"
                          ? "from-blue-500 to-blue-600"
                          : item.color === "green"
                          ? "from-green-500 to-green-600"
                          : "from-purple-500 to-purple-600"
                      } text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg`}
                    >
                      {item.step}
                    </div>
                  </div>

                  <div className="text-center pt-8">
                    {/* Icon */}
                    <div
                      className={`w-24 h-24 ${
                        item.color === "blue"
                          ? "bg-blue-50 border-blue-200"
                          : item.color === "green"
                          ? "bg-green-50 border-green-200"
                          : "bg-purple-50 border-purple-200"
                      } border-4 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl`}
                    >
                      {item.icon}
                    </div>

                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Tại sao chọn chúng tôi?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Những lý do khiến hàng ngàn người dùng tin tưởng lựa chọn nền tảng
              của chúng tôi
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuresData.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 h-full"
              >
                <div className="text-center">
                  <div
                    className={`w-24 h-24 ${
                      feature.color === "green"
                        ? "bg-green-100 border-green-200"
                        : feature.color === "blue"
                        ? "bg-blue-100 border-blue-200"
                        : "bg-purple-100 border-purple-200"
                    } border-4 rounded-full flex items-center justify-center mx-auto mb-6`}
                  >
                    <div
                      className={`${
                        feature.color === "green"
                          ? "text-green-600"
                          : feature.color === "blue"
                          ? "text-blue-600"
                          : "text-purple-600"
                      }`}
                    >
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Thống kê ấn tượng</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Những con số minh chứng cho sự tin tưởng và phát triển của cộng
              đồng
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {statsData.map((stat, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md p-8 rounded-2xl text-center border border-white/20 hover:bg-white/20 transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl border-2 border-white/30">
                  {stat.icon}
                </div>
                <div className="text-3xl lg:text-4xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-lg font-semibold mb-2 text-blue-100">
                  {stat.label}
                </div>
                <div className="text-blue-200">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Người dùng nói gì về chúng tôi
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Những phản hồi tích cực từ cộng đồng người dùng trên toàn quốc
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Nguyễn Thị Hoa",
                role: "Sinh viên",
                content:
                  "Tôi đã bán được nhiều đồ cũ và mua được những món đồ chất lượng với giá rẻ. Giao diện thân thiện, dễ sử dụng!",
                rating: 5,
                avatar: "H",
              },
              {
                name: "Trần Văn Nam",
                role: "Văn phòng",
                content:
                  "Nền tảng tuyệt vời để tìm kiếm đồ công nghệ cũ. Đã mua được laptop gaming với giá cực tốt.",
                rating: 5,
                avatar: "N",
              },
              {
                name: "Lê Thị Mai",
                role: "Chủ cửa hàng",
                content:
                  "Bán hàng trên đây rất thuận tiện. Khách hàng tin tưởng và giao dịch nhanh chóng, an toàn.",
                rating: 4,
                avatar: "M",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-600">{testimonial.role}</p>
                    <div className="flex mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`w-4 h-4 ${
                            i < testimonial.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 italic leading-relaxed">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-12 rounded-3xl shadow-2xl border border-gray-100 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Bắt đầu hành trình của bạn
            </h2>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Tham gia cộng đồng hàng triệu người dùng đang kinh doanh và mua
              sắm thông minh
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Link
                href="/eco-market/post-product"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Đăng tin ngay
              </Link>
              <Link
                href="/eco-market"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transform hover:-translate-y-1 transition-all duration-300"
              >
                <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
                Tìm kiếm sản phẩm
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircleIcon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Miễn phí đăng tin
                </h3>
                <p className="text-gray-600">
                  Không tốn phí để đăng bán sản phẩm
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Giao dịch an toàn
                </h3>
                <p className="text-gray-600">Hệ thống bảo mật cao cấp</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ChatBubbleLeftRightIcon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Hỗ trợ tận tình
                </h3>
                <p className="text-gray-600">Đội ngũ hỗ trợ 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Scroll to Top Button */}
      {isMounted && showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 z-50"
        >
          <ChevronUpIcon className="w-6 h-6 mx-auto" />
        </button>
      )}
    </div>
  );
};

export default Home;
