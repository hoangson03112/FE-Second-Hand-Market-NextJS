// Application constants
export const APP_NAME = "EcoMarket";
export const APP_DESCRIPTION = "Nền tảng mua bán đồ cũ thông minh và bền vững";

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },
  PRODUCTS: {
    BASE: "/products",
    SEARCH: "/products/search",
    FEATURED: "/products/featured",
    CATEGORIES: "/categories",
    FAVORITES: "/products/favorites",
  },
  USERS: {
    BASE: "/users",
    PROFILE: "/users/profile",
    ORDERS: "/users/orders",
  },
  UPLOAD: {
    IMAGE: "/upload/image",
    MULTIPLE: "/upload/multiple",
  },
} as const;

// Product conditions
export const PRODUCT_CONDITIONS = {
  NEW: { value: "new", label: "Mới" },
  LIKE_NEW: { value: "like_new", label: "Như mới" },
  VERY_GOOD: { value: "very_good", label: "Rất tốt" },
  GOOD: { value: "good", label: "Tốt" },
  ACCEPTABLE: { value: "acceptable", label: "Chấp nhận được" },
} as const;

// Product categories
export const PRODUCT_CATEGORIES = [
  {
    id: "electronics",
    name: "Đồ điện tử",
    icon: "📱",
    subcategories: [
      { id: "phones", name: "Điện thoại" },
      { id: "laptops", name: "Laptop" },
      { id: "cameras", name: "Máy ảnh" },
      { id: "accessories", name: "Phụ kiện" },
    ],
  },
  {
    id: "vehicles",
    name: "Xe cộ",
    icon: "🚗",
    subcategories: [
      { id: "cars", name: "Ô tô" },
      { id: "motorcycles", name: "Xe máy" },
      { id: "bicycles", name: "Xe đạp" },
      { id: "parts", name: "Phụ tùng" },
    ],
  },
  {
    id: "furniture",
    name: "Nội thất",
    icon: "🪑",
    subcategories: [
      { id: "chairs", name: "Bàn ghế" },
      { id: "storage", name: "Tủ kệ" },
      { id: "kitchen", name: "Đồ bếp" },
      { id: "appliances", name: "Thiết bị gia dụng" },
    ],
  },
  {
    id: "fashion",
    name: "Thời trang",
    icon: "👕",
    subcategories: [
      { id: "clothing", name: "Quần áo" },
      { id: "bags", name: "Túi xách" },
      { id: "shoes", name: "Giày dép" },
      { id: "watches", name: "Đồng hồ" },
    ],
  },
  {
    id: "baby",
    name: "Mẹ & Bé",
    icon: "👶",
    subcategories: [],
  },
  {
    id: "books",
    name: "Sách",
    icon: "📚",
    subcategories: [],
  },
] as const;

// Sort options
export const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "oldest", label: "Cũ nhất" },
  { value: "price_low_high", label: "Giá: Thấp đến cao" },
  { value: "price_high_low", label: "Giá: Cao đến thấp" },
  { value: "most_viewed", label: "Xem nhiều nhất" },
  { value: "most_favorited", label: "Yêu thích nhất" },
] as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50,
  PAGE_SIZE_OPTIONS: [12, 24, 36, 48],
} as const;

// Validation rules
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^(\+84|0)[0-9]{9,10}$/,
  PASSWORD_MIN_LENGTH: 6,
  PRODUCT_TITLE_MAX_LENGTH: 100,
  PRODUCT_DESCRIPTION_MAX_LENGTH: 2000,
  MAX_IMAGES_PER_PRODUCT: 10,
  MAX_IMAGE_SIZE_MB: 5,
} as const;

// UI Constants
export const UI = {
  HEADER_HEIGHT: "112px", // 28 * 4 = 112px (h-28)
  FOOTER_HEIGHT: "200px",
  SIDEBAR_WIDTH: "280px",
  MOBILE_BREAKPOINT: "768px",
  DESKTOP_BREAKPOINT: "1024px",
} as const;

// Date formats
export const DATE_FORMATS = {
  SHORT: "dd/MM/yyyy",
  LONG: "dd/MM/yyyy HH:mm",
  TIME_ONLY: "HH:mm",
  RELATIVE: "relative",
} as const;

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "authToken",
  USER_DATA: "userData",
  CART: "cart",
  FAVORITES: "favorites",
  RECENT_SEARCHES: "recentSearches",
  THEME: "theme",
  LANGUAGE: "language",
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Lỗi kết nối mạng. Vui lòng thử lại.",
  UNAUTHORIZED: "Bạn cần đăng nhập để thực hiện hành động này.",
  FORBIDDEN: "Bạn không có quyền thực hiện hành động này.",
  NOT_FOUND: "Không tìm thấy tài nguyên.",
  SERVER_ERROR: "Lỗi máy chủ. Vui lòng thử lại sau.",
  VALIDATION_ERROR: "Dữ liệu không hợp lệ.",
  FILE_TOO_LARGE: "File quá lớn. Vui lòng chọn file nhỏ hơn.",
  INVALID_FILE_TYPE: "Loại file không được hỗ trợ.",
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Đăng nhập thành công!",
  REGISTER_SUCCESS: "Đăng ký thành công!",
  LOGOUT_SUCCESS: "Đăng xuất thành công!",
  PROFILE_UPDATE_SUCCESS: "Cập nhật hồ sơ thành công!",
  PRODUCT_CREATED: "Đăng tin thành công!",
  PRODUCT_UPDATED: "Cập nhật sản phẩm thành công!",
  PRODUCT_DELETED: "Xóa sản phẩm thành công!",
  PASSWORD_CHANGED: "Đổi mật khẩu thành công!",
} as const;

// Contact information
export const CONTACT_INFO = {
  EMAIL: "support@ecomarket.vn",
  PHONE: "1900-1234",
  ADDRESS: "123 Đường ABC, Quận 1, TP.HCM",
  BUSINESS_HOURS: "Thứ 2 - Chủ nhật: 8:00 - 22:00",
} as const;

// Social media links
export const SOCIAL_LINKS = {
  FACEBOOK: "https://facebook.com/ecomarket.vn",
  INSTAGRAM: "https://instagram.com/ecomarket.vn",
  TWITTER: "https://twitter.com/ecomarket_vn",
  YOUTUBE: "https://youtube.com/ecomarket",
} as const;


