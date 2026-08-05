"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Background } from "@/components/shared";
import { loginFeatures } from "@/constants";
import { useUser } from "@/hooks/useUser";
import { useLogin } from "./hooks/useLogin";
import LoginForm from "./components/LoginForm";

export default function Login() {
  const router = useRouter();
  const { data: account } = useUser();
  const {
    formData,
    isLoading,
    rememberMe,
    handleChange,
    setRememberMe,
    handleSubmit,
    handleGoogleLogin,
  } = useLogin();

  const searchParams = useSearchParams();

  useEffect(() => {
    if (account) {
      const redirect = searchParams.get("redirect");
      const target =
        redirect && redirect.startsWith("/") && !redirect.startsWith("//")
          ? redirect
          : "/";
      router.replace(target);
    }
  }, [account, router, searchParams]);

  if (account) {
    return null;
  }

  return (
    <Background>
      <div className="flex-1 flex items-center justify-center py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-8xl mx-auto">
          <div className="relative min-h-[85vh] w-full flex items-center justify-center overflow-hidden">
            <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-24 items-center w-full max-w-6xl relative z-10">
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
                  Chào mừng <br />
                  <span
                    className="text-accent"
                    style={{ letterSpacing: "-0.02em", fontStyle: "italic" }}
                  >
                    trở lại
                  </span>
                </h1>

                <p className="text-lg md:text-xl mb-12 max-w-md text-foreground/70 font-medium">
                  Đăng nhập để tiếp tục tham gia mạng lưới mua sắm xanh, tiết
                  kiệm và bền vững cùng chúng tôi.
                </p>

                {/* List tính năng thiết kế kiểu Minimalist Luxury */}
                <div className="space-y-6 hidden md:block">
                  {loginFeatures.map(
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

              {/* PHẦN FORM BÊN PHẢI: Chuyển toàn bộ màu sắc sang Foreground */}
              <div className="w-full">
                <div className="lg:hidden flex justify-center mb-8">
                  <Link href="/" className="inline-block">
                    <Image
                      src="https://res.cloudinary.com/dqvtj4uxo/image/upload/v1784993079/Gemini_Generated_Image_rg4xa9rg4xa9rg4x_1_mtjahn.png"
                      alt="Eco Market"
                      width={100}
                      height={100}
                      className="h-16 w-auto"
                      priority
                    />
                  </Link>
                </div>
                <div className="bg-white/90 backdrop-blur-md border border-gray-100 rounded-3xl shadow-2xl shadow-taupe-900/10 p-8 sm:p-10 lg:p-12 space-y-8">
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
                      Đăng nhập
                    </h2>
                  </div>
                  <LoginForm
                    formData={formData}
                    isLoading={isLoading}
                    rememberMe={rememberMe}
                    handleChange={handleChange}
                    setRememberMe={setRememberMe}
                    handleSubmit={handleSubmit}
                    handleGoogleLogin={handleGoogleLogin}
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
