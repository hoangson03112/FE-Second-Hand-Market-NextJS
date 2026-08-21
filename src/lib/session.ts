/**
 * Trạng thái phiên phía client.
 *
 * accessToken/refreshToken đều là cookie httpOnly, nên JavaScript trong trình
 * duyệt KHÔNG đọc được — không có cách nào biết "đang đăng nhập hay chưa" từ
 * `document.cookie`. Việc kiểm tra đó chuyển hẳn sang phía server:
 *
 *   1. `middleware.ts` (edge) đọc cookie từ request để chặn sớm route riêng tư,
 *   2. `app/layout.tsx` (server component) đọc cookie rồi truyền xuống
 *      `Providers`, để `useUser()` biết có cần gọi /auth/me hay không.
 *
 * Module này chỉ còn lo phần phát tín hiệu khi phiên đổi trạng thái.
 */

/** Tên cookie refresh token do backend set — dùng làm dấu hiệu "có phiên". */
export const SESSION_COOKIE = "refreshToken";

/** Sự kiện trong CÙNG tab (BroadcastChannel không tự gửi lại cho nơi phát). */
export const SESSION_CHANGED_EVENT = "eco:session-changed";

/** Kênh đồng bộ giữa CÁC tab đang mở. */
export const SESSION_CHANNEL = "eco:session";

export type SessionSignal = "signed-in" | "signed-out";

/**
 * Báo trạng thái phiên vừa đổi: cho chính tab này (CustomEvent) và cho các tab
 * khác (BroadcastChannel). Nhờ vậy đăng xuất ở một tab thì mọi tab cùng thoát,
 * đăng nhập ở một tab thì mọi tab cùng nhận ra.
 */
export function announceSession(signal: SessionSignal): void {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent<SessionSignal>(SESSION_CHANGED_EVENT, { detail: signal }),
  );

  if (typeof window !== "undefined" && "BroadcastChannel" in window) {
    const channel = new BroadcastChannel(SESSION_CHANNEL);
    channel.postMessage(signal);
    channel.close();
  }
}

/**
 * Phiên đã mất (refresh thất bại, tài khoản bị khoá).
 *
 * Cố ý KHÔNG điều hướng ở đây — ép `window.location` từ trong interceptor chính
 * là thứ tạo ra vòng lặp redirect với middleware. Route guard tự xử lý dựa trên
 * `useUser()`.
 *
 * Cookie httpOnly do backend xoá qua header Set-Cookie ở chính response thất
 * bại đó; client chỉ cần cập nhật lại UI.
 */
export function notifySessionLost(): void {
  if (typeof window === "undefined") return;
  announceSession("signed-out");
}
