import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { SESSION_HINT_COOKIE } from "@/lib/session";

/**
 * Chặn sớm ở tầng edge để người dùng không thấy màn hình loading rồi mới bị
 * đá về /login. Đây CHỈ là lớp UX — quyền truy cập thật do backend quyết định
 * trên từng request, nên ở đây chỉ cần đọc cờ phiên (cookie do FE tự quản lý),
 * không phụ thuộc cookie httpOnly của backend vốn có thể nằm ở host khác.
 */
const PROTECTED_PREFIXES = [
  "/profile",
  "/orders",
  "/cart",
  "/checkout",
  "/payment",
  "/my",
  "/sell",
  "/seller",
  "/become-seller",
  "/notifications",
  "/admin",
];

/**
 * Trang chỉ dành cho khách; đã đăng nhập thì không cần vào nữa.
 * Cố ý KHÔNG chặn /reset-password và /verify-email: người dùng có thể bấm link
 * trong email khi vẫn đang đăng nhập ở tab khác.
 */
const GUEST_ONLY_PREFIXES = ["/login", "/register", "/forgot-password"];

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const hasSession =
    request.cookies.get(SESSION_HINT_COOKIE)?.value === "1";

  if (!hasSession && PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (hasSession && GUEST_ONLY_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
