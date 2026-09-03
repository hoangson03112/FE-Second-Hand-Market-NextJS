

export function getAvatarUrl(avatar: unknown): string | null {
  if (typeof avatar === "string") return avatar;
  const obj = avatar as { url?: string };
  return obj?.url ?? null;
}


export function getUserInitials(fullName: string): string {
  if (!fullName || fullName.trim().length === 0) return "";

  const names = fullName.trim().split(/\s+/);
  if (names.length === 1) {
    return names[0][0].toUpperCase();
  }

  const firstInitial = names[0][0];
  const lastInitial = names[names.length - 1][0];
  return (firstInitial + lastInitial).toUpperCase();
}


export function getPlaceholderAvatar(
  fullName: string,
  options: {
    size?: number;
    background?: string;
    color?: string;
    rounded?: boolean;
  } = {}
): string {
  const {
    size = 128,
    background = "random",
    color = "fff",
    rounded = true,
  } = options;

  const params = new URLSearchParams({
    name: fullName || "User",
    size: size.toString(),
    background,
    color,
    rounded: rounded.toString(),
  });

  return `https://ui-avatars.com/api/?${params.toString()}`;
}


export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;

  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname.toLowerCase();
    const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];

    return validExtensions.some((ext) => pathname.endsWith(ext));
  } catch {
    return false;
  }
}
