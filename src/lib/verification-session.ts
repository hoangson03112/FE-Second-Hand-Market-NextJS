/**
 * Phiên xác minh email phía client.
 *
 * BE không trả accountID ra ngoài nữa — nó trả `verificationToken`, một handle
 * mờ đục trỏ tới tài khoản đang chờ xác minh (mẫu `Session` của Cognito,
 * `stateToken` của Okta). Module này lo chỗ giữ handle đó giữa hai màn hình
 * đăng ký/đăng nhập → nhập mã.
 *
 * Vì sao sessionStorage mà không phải query string: URL đi vào history, vào
 * header Referer, vào log của proxy/CDN. Vì sao không phải localStorage: token
 * chỉ có nghĩa cho đúng luồng đang làm, hết tab là hết việc.
 *
 * Token không phải credential — có nó vẫn phải có mã 6 số trong hộp thư mới
 * làm được gì. Nên mất token không nguy hiểm, chỉ bất tiện: người dùng đăng
 * nhập lại là BE phát phiên mới.
 */

const TOKEN_KEY = "eco:verify-token";
const MASKED_EMAIL_KEY = "eco:verify-email";

export interface VerificationSession {
  token: string;
  maskedEmail?: string;
}

/** Đọc/ghi sessionStorage có thể ném (Safari private mode, cấu hình chặn). */
function safeGet(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

export function saveVerificationSession(
  token: string | undefined,
  maskedEmail?: string,
): boolean {
  if (!token) return false;
  try {
    sessionStorage.setItem(TOKEN_KEY, token);
    if (maskedEmail) sessionStorage.setItem(MASKED_EMAIL_KEY, maskedEmail);
    return true;
  } catch {
    return false;
  }
}

export function readVerificationSession(): VerificationSession | null {
  const token = safeGet(TOKEN_KEY);
  if (!token) return null;
  return { token, maskedEmail: safeGet(MASKED_EMAIL_KEY) ?? undefined };
}

export function clearVerificationSession(): void {
  try {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(MASKED_EMAIL_KEY);
  } catch {
    /* Không đọc/ghi được thì cũng chẳng có gì để xoá. */
  }
}
