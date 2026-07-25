"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Background } from "@/components/shared";
import { registerFeatures } from "@/constants";
import { useUser } from "@/hooks/useUser";
import { useRegister } from "./hooks/useRegister";
import RegisterForm from "./components/RegisterForm";

export default function Register() {
  const router = useRouter();
  const { data: account } = useUser();
  const {
    formData,
    isLoading,
    handleChange,
    handleConfirmPasswordChange,
    handleBlur,
    handleSubmit,
  } = useRegister();

  // Nếu đã đăng nhập thì redirect về trang Home
  useEffect(() => {
    if (account) {
      router.replace("/");
    }
  }, [account, router]);

  if (account) {
    return null;
  }

  return (
    <Background>
      <div className="flex-1 flex items-center justify-center py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-8xl mx-auto">
          <div className="relative min-h-[85vh] w-full flex items-center justify-center overflow-hidden">
            <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-24 items-center w-full max-w-6xl relative z-10">
              
              {/* BRANDING TƯƠNG TỰ MÀN LOGIN */}
              <div className="flex flex-col justify-center px-2 lg:px-0 pointer-events-none">
                <h1
                  className="mb-8 text-luxury-ink drop-shadow-sm"
                  style={{
                    fontFamily: "var(--font-droid-serif), serif",
                    fontSize: "clamp(3rem, 6vw, 5.5rem)",
                    fontWeight: 300,
                    lineHeight: 1.05,
                    letterSpacing: "-0.03em",
                  }}
                >
                  Tham gia <br />
                  <span
                    className="text-accent"
                    style={{ letterSpacing: "-0.02em", fontStyle: "italic" }}
                  >
                    cộng đồng!
                  </span>
                </h1>

                <p className="text-lg md:text-xl mb-12 max-w-md text-foreground/70 font-medium">
                  Đăng ký để bắt đầu mua bán đồ cũ thông minh và bảo vệ môi trường cùng chúng tôi.
                </p>

                <div className="space-y-6 hidden md:block">
                  {registerFeatures.map(
                    (
                      feature: { title: string; description?: string },
                      idx: number,
                    ) => (
                      <div key={idx} className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full border border-foreground/20 flex items-center justify-center mt-0.5 text-foreground">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-foreground font-medium text-[15px]">
                            {feature.title}
                          </h3>
                          {feature.description && (
                            <p className="text-foreground/60 text-sm mt-1 leading-relaxed max-w-sm">
                              {feature.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* PHẦN FORM BÊN PHẢI */}
              <div className="w-full">
                <div className="lg:hidden flex justify-center mb-8">
                  <Link href="/" className="inline-block">
                    <Image
                      src="https://res.cloudinary.com/dqvtj4uxo/image/upload/v1755696284/logi_ov2gbl.png"
                      alt="Eco Market"
                      width={100}
                      height={100}
                      className="h-16 w-auto"
                      priority
                    />
                  </Link>
                </div>
                <div className="bg-white/90 backdrop-blur-md border border-gray-100 rounded-3xl shadow-2xl shadow-taupe-900/10 p-8 sm:p-10 lg:p-12 space-y-8 max-h-[calc(100vh-8rem)] overflow-y-auto">
                  <div className="space-y-1 text-center">
                    <h2
                      style={{
                        fontFamily: "var(--font-droid-serif), serif",
                        fontWeight: 300,
                        lineHeight: 1.05,
                        letterSpacing: "-0.03em",
                      }}
                      className="text-4xl mb-8 text-luxury-ink"
                    >
                      Đăng ký
                    </h2>
                    <p className="text-taupe-600">Tạo tài khoản mới để bắt đầu</p>
                  </div>
                  
                  <RegisterForm
                    formData={formData}
                    isLoading={isLoading}
                    handleChange={handleChange}
                    handleConfirmPasswordChange={handleConfirmPasswordChange}
                    handleBlur={handleBlur}
                    handleSubmit={handleSubmit}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Background>
  );
}
