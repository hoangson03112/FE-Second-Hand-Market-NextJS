# Checkout Components

Giao diện xác nhận đơn hàng trước khi thanh toán.

## 📦 Components

### 1. **CheckOutPage** (Main Container)
- Layout 2 cột: Form (bên trái) + Summary (bên phải)
- Quản lý state: payment method, loading
- Xử lý flow checkout

### 2. **ShippingForm**
Form nhập thông tin giao hàng:
- Họ tên, SĐT, Email
- Địa chỉ đầy đủ (Tỉnh/TP, Quận/Huyện, Phường/Xã)
- Ghi chú đơn hàng

### 3. **PaymentMethod**
Chọn phương thức thanh toán:
- COD (Thanh toán khi nhận hàng)
- Chuyển khoản ngân hàng
- Ví MoMo
- VNPay

### 4. **OrderItems**
Hiển thị danh sách sản phẩm:
- Hình ảnh, tên, giá
- Số lượng
- Tình trạng

### 5. **CheckoutSummary**
Tóm tắt đơn hàng:
- Tạm tính
- Phí vận chuyển
- Giảm giá
- Tổng cộng
- Trust badges

## 🎨 Layout

```
┌─────────────────────────────────────────────────────────────┐
│  ← Quay lại                                                 │
│  🛍️ Xác Nhận Đơn Hàng                                       │
├──────────────────────────────┬──────────────────────────────┤
│  FORM (2/3)                  │  SUMMARY (1/3) - Sticky      │
├──────────────────────────────┼──────────────────────────────┤
│  📦 Thông Tin Giao Hàng      │  📋 Sản Phẩm (1)             │
│  - Họ tên, SĐT, Email        │  - Item 1 + Image            │
│  - Địa chỉ đầy đủ            │  - Giá x Số lượng            │
│  - Ghi chú                   │                              │
│                              │  💰 Tóm Tắt Đơn Hàng         │
│  💳 Phương Thức Thanh Toán   │  - Tạm tính                  │
│  ○ COD                       │  - Phí vận chuyển            │
│  ● Chuyển khoản              │  - Giảm giá                  │
│  ○ MoMo (Khuyến nghị)        │  - Tổng: 18,500,000₫         │
│  ○ VNPay                     │                              │
│                              │  [Đặt hàng - 18,500,000₫]    │
│                              │                              │
│                              │  ✅ Trust Badges             │
└──────────────────────────────┴──────────────────────────────┘
```

## 🔄 Data Flow

```typescript
CheckOutPage
├── ShippingForm → handleShippingSubmit()
├── PaymentMethod → setPaymentMethod()
├── OrderItems → mockItems (từ cart/product)
├── CheckoutSummary → calculate total
└── handleCheckout() → API call → redirect
```

## ✅ Features

- ✅ Responsive 2-column layout
- ✅ Form validation
- ✅ Payment method selection
- ✅ Order summary with calculations
- ✅ Loading state
- ✅ Trust badges
- ✅ Sticky summary on scroll
- ✅ Mobile-friendly

## 🚀 Usage

```tsx
import CheckOutPage from "@/components/feature/checkout";

export default function Page() {
  return <CheckOutPage />;
}
```

## 📝 TODO

- [ ] Integrate with real cart API
- [ ] Add address autocomplete
- [ ] Add coupon code input
- [ ] Connect payment gateways
- [ ] Add order confirmation page
- [ ] Email notification


