"use client";

import { createContext, useContext } from "react";

/**
 * "Request này có cookie phiên hay không".
 *
 * accessToken/refreshToken là cookie httpOnly nên client không đọc được. Giá
 * trị khởi tạo do `app/layout.tsx` (server component) đọc từ cookie và truyền
 * xuống `Providers`, sau đó `Providers` tự cập nhật theo tín hiệu đăng
 * nhập/đăng xuất.
 *
 * Chỉ là gợi ý để `useUser()` khỏi gọi /auth/me với khách vãng lai — mọi quyền
 * truy cập thật vẫn do backend quyết định trên từng request.
 */
export const SessionContext = createContext(false);

export function useHasSession() {
  return useContext(SessionContext);
}
