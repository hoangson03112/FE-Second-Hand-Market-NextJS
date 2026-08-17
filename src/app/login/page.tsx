import { Suspense } from "react";
import Login from "@/features/auth/login/Login";

export const metadata = {
  title: "Đăng nhập",
  description: "Đăng nhập để tiếp tục mua sắm xanh cùng Eco Market",
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60svh] items-center justify-center bg-luxury-ivory">
          <div className="h-10 w-10 animate-spin rounded-full border border-luxury-ink/15 border-t-luxury-ink" />
        </div>
      }
    >
      <Login />
    </Suspense>
  );
}
