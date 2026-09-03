

const TOKEN_KEY = "eco:verify-token";
const MASKED_EMAIL_KEY = "eco:verify-email";

export interface VerificationSession {
  token: string;
  maskedEmail?: string;
}


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
