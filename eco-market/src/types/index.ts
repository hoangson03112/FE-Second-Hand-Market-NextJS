// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  phoneNumber?: string;
  address?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  bio?: string;
  rating: number;
  totalSales: number;
  joinedDate: string;
}

// Product types
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: Category;
  condition: ProductCondition;
  status: ProductStatus;
  seller: User;
  location: string;
  views: number;
  favorites: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCreateInput {
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: File[];
  categoryId: string;
  condition: ProductCondition;
  location: string;
}

export enum ProductCondition {
  NEW = "new",
  LIKE_NEW = "like_new",
  VERY_GOOD = "very_good",
  GOOD = "good",
  ACCEPTABLE = "acceptable",
}

export enum ProductStatus {
  ACTIVE = "active",
  SOLD = "sold",
  INACTIVE = "inactive",
  PENDING = "pending",
}

// Category types
export interface Category {
  _id: string;
  name: string;
  subCategories?: SubCategory[];
}
export interface SubCategory {
  _id: string;
  name: string;
}
// Order types
export interface Order {
  id: string;
  product: Product;
  buyer: User;
  seller: User;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  createdAt: string;
  updatedAt: string;
}

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  COMPLETED = "completed",
}

// Address types
export interface Address {
  id: string;
  fullName: string;
  phoneNumber: string;
  street: string;
  ward: string;
  district: string;
  province: string;
  postalCode?: string;
  isDefault: boolean;
}

// Payment types
export interface PaymentMethod {
  id: string;
  type: PaymentType;
  provider: string;
  accountNumber?: string;
  isDefault: boolean;
}

export enum PaymentType {
  CASH = "cash",
  BANK_TRANSFER = "bank_transfer",
  CREDIT_CARD = "credit_card",
  E_WALLET = "e_wallet",
}

// Chat types
export interface Conversation {
  id: string;
  participants: User[];
  product?: Product;
  lastMessage?: Message;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: User;
  content: string;
  type: MessageType;
  attachments?: string[];
  isRead: boolean;
  createdAt: string;
}

export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  OFFER = "offer",
  SYSTEM = "system",
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}

export enum NotificationType {
  NEW_MESSAGE = "new_message",
  PRODUCT_SOLD = "product_sold",
  ORDER_UPDATE = "order_update",
  PRICE_DROP = "price_drop",
  FAVORITE_AVAILABLE = "favorite_available",
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Search types
export interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: ProductCondition;
  location?: string;
  sortBy?: SortOption;
}

export enum SortOption {
  NEWEST = "newest",
  OLDEST = "oldest",
  PRICE_LOW_HIGH = "price_low_high",
  PRICE_HIGH_LOW = "price_high_low",
  MOST_VIEWED = "most_viewed",
  MOST_FAVORITED = "most_favorited",
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Error types
export interface FormError {
  field: string;
  message: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
