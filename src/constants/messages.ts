/**
 * Centralized UI message constants (Vietnamese with accents)
 * All user-facing text should use these constants instead of hardcoded strings.
 */

// ============================================================================
// Auth messages
// ============================================================================
export const AUTH_MESSAGES = {
  // Login
  LOGIN_SUCCESS: "Đăng nhập thành công",
  LOGIN_FAILED: "Sai tên đăng nhập hoặc mật khẩu",
  ACCOUNT_NOT_ACTIVATED: "Tài khoản chưa được kích hoạt",

  // Register / verify
  VERIFY_CODE_SENT: "Đã gửi mã xác nhận đến email của bạn",
  VERIFY_SUCCESS: "Xác minh tài khoản thành công",
  VERIFY_INVALID_CODE: "Mã xác nhận không hợp lệ hoặc đã hết hạn",

  // Forgot / Reset password
  FORGOT_PASSWORD_EMAIL_SENT: "Link đặt lại mật khẩu đã được gửi đến email của bạn",
  FORGOT_PASSWORD_EMAIL_NOT_FOUND: "Nếu email tồn tại, bạn sẽ nhận được link đặt lại mật khẩu",
  FORGOT_PASSWORD_GOOGLE_UNSUPPORTED: "Tài khoản Google không hỗ trợ đặt lại mật khẩu",
  FORGOT_PASSWORD_SEND_FAILED: "Không thể gửi email. Vui lòng thử lại sau.",
  RESET_PASSWORD_SUCCESS: "Đổi mật khẩu thành công",
  RESET_PASSWORD_INVALID_TOKEN: "Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn",

  // Connection
  CONNECTION_ERROR: "Không thể kết nối đến máy chủ",
  GENERAL_ERROR: "Có lỗi xảy ra, vui lòng thử lại",

  // Logout
  LOGOUT_SUCCESS: "Đăng xuất thành công",
} as const;

// ============================================================================
// Address messages
// ============================================================================
export const ADDRESS_MESSAGES = {
  ADD_SUCCESS: "Đã thêm địa chỉ thành công",
  ADD_ERROR: "Không thể thêm địa chỉ. Vui lòng kiểm tra và thử lại.",
  UPDATE_SUCCESS: "Đã cập nhật địa chỉ thành công",
  UPDATE_ERROR: "Không thể cập nhật địa chỉ. Vui lòng thử lại.",
  DELETE_SUCCESS: "Đã xóa địa chỉ thành công",
  DELETE_ERROR: "Không thể xóa địa chỉ. Vui lòng thử lại",
} as const;

// ============================================================================
// Cart messages
// ============================================================================
export const CART_MESSAGES = {
  ADD_SUCCESS: "Đã thêm vào giỏ hàng",
  ADD_ERROR: "Không thể thêm vào giỏ hàng",
  LOAD_ERROR: "Không thể tải thông tin sản phẩm. Vui lòng thử lại.",
} as const;

// ============================================================================
// Checkout messages
// ============================================================================
export const CHECKOUT_MESSAGES = {
  NO_ADDRESS: "Vui lòng chọn địa chỉ giao hàng",
  SHIPPING_LOADING: "Vui lòng đợi tính phí vận chuyển hoàn tất",
  CART_EMPTY: "Giỏ hàng trống",
  ORDER_ERROR: "Không thể đặt hàng. Vui lòng thử lại.",
} as const;

// ============================================================================
// Order messages
// ============================================================================
export const ORDER_MESSAGES = {
  CANCEL_SUCCESS: "Đã hủy đơn hàng",
  CANCEL_FAILED: "Hủy đơn thất bại, vui lòng thử lại.",
  CANCEL_ERROR: "Không thể hủy đơn hàng",
  CONFIRM_RECEIVED_SUCCESS: "Đã xác nhận nhận hàng thành công!",
  CONFIRM_RECEIVED_FAILED: "Xác nhận thất bại, vui lòng thử lại.",
  CONFIRM_RECEIVED_ERROR: "Không thể xác nhận nhận hàng",
  LOAD_ERROR: "Không thể tải đơn hàng",
} as const;

// ============================================================================
// Review messages
// ============================================================================
export const REVIEW_MESSAGES = {
  SELLER_REVIEW_SUCCESS: "Đã gửi đánh giá thành công!",
  SELLER_REVIEW_ERROR: "Không thể gửi đánh giá",
  PRODUCT_REVIEW_SUCCESS: "Đã gửi đánh giá sản phẩm thành công!",
  PRODUCT_REVIEW_ERROR: "Không thể gửi đánh giá sản phẩm",
} as const;

// ============================================================================
// Refund messages
// ============================================================================
export const REFUND_MESSAGES = {
  REQUEST_SUCCESS: "Đã gửi yêu cầu hoàn tiền!",
  REQUEST_ERROR: "Không thể gửi yêu cầu hoàn tiền",
  DISPUTE_ESCALATE_SUCCESS: "Đã gửi khiếu nại lên Admin. Quản trị viên sẽ xem xét và phản hồi.",
  DISPUTE_ESCALATE_ERROR: "Không thể gửi khiếu nại. Vui lòng thử lại.",
} as const;

// ============================================================================
// Product messages (extends existing PRODUCT_MESSAGES in product.ts)
// ============================================================================
export const PRODUCT_UI_MESSAGES = {
  NOT_FOUND: "Không tìm thấy sản phẩm",
  LOAD_ERROR: "Không tải được thông tin sản phẩm",
  LIST_LOAD_ERROR: "Không thể tải danh sách sản phẩm của bạn. Vui lòng thử lại.",
  UPDATE_SUCCESS: "Cập nhật sản phẩm thành công",
  UPDATE_AND_REVIEW_SUCCESS: "Cập nhật và yêu cầu duyệt lại thành công! Admin sẽ xem xét trong 24h.",
  UPDATE_REVIEW_REQUEST_ERROR: "Không thể gửi yêu cầu duyệt lại. Vui lòng thử lại sau.",
  PUBLISH_SUCCESS: "Đăng sản phẩm thành công",
  REVIEW_REQUEST_SUCCESS: "Đã gửi yêu cầu duyệt lại. Admin sẽ xem xét trong vòng 24h.",
  REVIEW_REQUEST_ERROR: "Không thể gửi yêu cầu duyệt lại",
  REPORT_REASON_REQUIRED: "Vui lòng nhập lý do báo cáo",
  REPORT_SUCCESS: "Đã gửi báo cáo. Chúng tôi sẽ xem xét sớm.",
  REPORT_ERROR: "Không thể gửi báo cáo",
} as const;

// ============================================================================
// Seller messages
// ============================================================================
export const SELLER_MESSAGES = {
  SELLER_ORDER_CONFIRM_SUCCESS: "Đã xác nhận đơn hàng",
  SELLER_ORDER_CANCEL_SUCCESS: "Đã hủy đơn hàng",
  SELLER_ORDER_ACTION_ERROR: "Không thể xử lý đơn hàng",
  SELLER_ORDER_LOAD_ERROR: "Không thể tải đơn hàng",
  SELLER_REFUND_AGREED: "Đã đồng ý hoàn tiền, admin sẽ xử lý tiếp",
  SELLER_REFUND_ERROR: "Không thể xử lý yêu cầu hoàn tiền",
  SELLER_STATUS_UPDATE_ERROR: "Không thể cập nhật trạng thái seller. Vui lòng thử lại.",
  CONTACT_SELLER_ERROR: "Không thể liên hệ người bán",
  CHAT_OPENING: (name: string) => `Đang mở chat với ${name}`,
} as const;

// ============================================================================
// Admin messages
// ============================================================================
export const ADMIN_MESSAGES = {
  CATEGORY_UPDATE_SUCCESS: "Cập nhật danh mục thành công",
  SUBCATEGORY_CREATE_SUCCESS: "Đã tạo danh mục con thành công",
  SUBCATEGORY_UPDATE_SUCCESS: "Cập nhật danh mục con thành công",
  SUBCATEGORY_DELETE_SUCCESS: "Đã xóa danh mục con thành công",
  PAYOUT_ACTIVATE_SUCCESS: "Đã kích hoạt thanh toán thành công",
  PAYOUT_ACTIVATE_ERROR: "Không thể kích hoạt thanh toán",
  REFUND_APPROVE_SUCCESS: "Đã duyệt hoàn tiền thành công",
  REFUND_APPROVE_ERROR: "Không thể duyệt hoàn tiền",
  REFUND_REJECT_SUCCESS: "Đã từ chối hoàn tiền",
  REFUND_REJECT_ERROR: "Không thể từ chối hoàn tiền",
} as const;

// ============================================================================
// Payment messages
// ============================================================================
export const PAYMENT_MESSAGES = {
  ORDER_LOAD_ERROR: "Không thể tải thông tin đơn hàng",
} as const;

// ============================================================================
// Share messages
// ============================================================================
export const SHARE_MESSAGES = {
  COPY_SUCCESS: "Đã copy link!",
  COPY_ERROR: "Không thể copy link",
} as const;

// ============================================================================
// Feature info (help users understand platform rules)
// ============================================================================
export const FEATURE_INFO = {
  /** Sell page: product limit for non-seller */
  SELLER_LIMIT: (used: number, limit: number) =>
    `Bạn đã đăng ${used}/${limit} sản phẩm. Tài khoản thường giới hạn ${limit} sản phẩm. Đăng ký Seller để đăng không giới hạn và nhận thanh toán qua ngân hàng.`,
  /** Sell page: seller has no limit */
  SELLER_UNLIMITED: "Bạn là Seller — đăng sản phẩm không giới hạn và nhận thanh toán online.",
  /** Checkout: why bank transfer is not available */
  PAYMENT_COD_ONLY:
    "Người bán chưa xác minh Seller — chỉ thanh toán khi nhận hàng (COD). Đơn từ Seller đã xác minh mới có thanh toán trước qua ngân hàng.",
  /** Order detail: review policy */
  REVIEW_PRODUCT_RULE:
    "Sản phẩm còn nhiều trong kho (stock > 1) mới được đánh giá sản phẩm. Bạn luôn có thể đánh giá người bán để giúp cộng đồng tin tưởng hơn.",
  /** Order detail: seller review tip */
  REVIEW_SELLER_TIP: "Đánh giá người bán giúp người mua khác tin tưởng hơn khi giao dịch.",
} as const;

// ============================================================================
// General / common
// ============================================================================
export const COMMON_MESSAGES = {
  SERVER_ERROR: "Lỗi máy chủ, vui lòng thử lại sau",
  LOADING: "Đang tải...",
  PROCESSING: "Đang xử lý...",
  UNAUTHORIZED: "Bạn không có quyền thực hiện thao tác này",
  NOT_FOUND: "Không tìm thấy",
} as const;
