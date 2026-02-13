/**
 * Avatar utility functions
 * Helper functions for handling avatar URLs and user profile images
 */

/**
 * Extract avatar URL from various avatar data formats
 * Handles both string URLs and object with url property
 * 
 * @param avatar - Avatar data (can be string, object with url, or null/undefined)
 * @returns Avatar URL string or null if not found
 * 
 * @example
 * getAvatarUrl("https://example.com/avatar.jpg") // "https://example.com/avatar.jpg"
 * getAvatarUrl({ url: "https://example.com/avatar.jpg" }) // "https://example.com/avatar.jpg"
 * getAvatarUrl(null) // null
 */
export function getAvatarUrl(avatar: unknown): string | null {
  if (typeof avatar === "string") return avatar;
  const obj = avatar as { url?: string };
  return obj?.url ?? null;
}

/**
 * Get user initials from full name for avatar placeholder
 * 
 * @param fullName - User's full name
 * @returns First letters of first and last name (up to 2 characters)
 * 
 * @example
 * getUserInitials("Nguyễn Văn A") // "NA"
 * getUserInitials("John") // "J"
 * getUserInitials("") // ""
 */
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

/**
 * Generate a placeholder avatar URL based on user name
 * Uses UI Avatars service to generate avatar with initials
 * 
 * @param fullName - User's full name
 * @param options - Optional configuration
 * @returns Generated avatar URL
 * 
 * @example
 * getPlaceholderAvatar("Nguyễn Văn A") 
 * // "https://ui-avatars.com/api/?name=Nguy%E1%BB%85n+V%C4%83n+A&size=128&background=random"
 */
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

/**
 * Validate if a URL is a valid image URL
 * Checks if URL has common image extensions
 * 
 * @param url - URL to validate
 * @returns True if URL appears to be an image
 */
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
