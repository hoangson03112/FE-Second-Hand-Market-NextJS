/**
 * Profile-related constants
 * User profile, password change, and account settings
 */

// ============================================================================
// Profile Tabs
// ============================================================================

export const PROFILE_TABS = {
  PROFILE: "profile" as const,
  PASSWORD: "password" as const,
};

// ============================================================================
// Validation Rules
// ============================================================================

export const PASSWORD_MIN_LENGTH = 6;

// ============================================================================
// Messages
// ============================================================================

export const PROFILE_MESSAGES = {
  PASSWORD_MISMATCH: "Mật khẩu xác nhận không khớp",
  PASSWORD_TOO_SHORT: `Mật khẩu mới phải có ít nhất ${PASSWORD_MIN_LENGTH} ký tự`,
  PROFILE_UPDATE_SUCCESS: "Cập nhật thông tin thành công",
  PROFILE_UPDATE_ERROR: "Không thể cập nhật thông tin",
  PASSWORD_CHANGE_SUCCESS: "Đổi mật khẩu thành công",
  PASSWORD_CHANGE_ERROR: "Không thể đổi mật khẩu",
  LOADING: "Đang tải...",
} as const;
