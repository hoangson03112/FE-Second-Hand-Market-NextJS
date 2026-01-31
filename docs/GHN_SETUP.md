# Hướng dẫn cấu hình GHN (Giao Hàng Nhanh) API

## Tổng quan

Dự án sử dụng API của Giao Hàng Nhanh (GHN) để tính phí vận chuyển và thời gian giao hàng dự kiến cho đơn hàng.

## Yêu cầu

1. Tài khoản GHN (đăng ký tại https://ghn.vn)
2. Shop ID và Token từ GHN

## Cấu hình biến môi trường

Thêm các biến sau vào file `.env` của bạn:

```env
# GHN API Configuration
NEXT_PUBLIC_GHN_API_URL=https://dev-online-gateway.ghn.vn/shiip/public-api
NEXT_PUBLIC_GHN_TOKEN=your_ghn_token_here
NEXT_PUBLIC_GHN_SHOP_ID=your_shop_id_here
NEXT_PUBLIC_GHN_FROM_DISTRICT_ID=1542
```

### Chi tiết biến môi trường

- **NEXT_PUBLIC_GHN_API_URL**: URL của GHN API
  - Dev: `https://dev-online-gateway.ghn.vn/shiip/public-api`
  - Production: `https://online-gateway.ghn.vn/shiip/public-api`

- **NEXT_PUBLIC_GHN_TOKEN**: Token xác thực API
  - Lấy từ: GHN Dashboard > Cài đặt > Cấu hình API

- **NEXT_PUBLIC_GHN_SHOP_ID**: ID của shop trên GHN
  - Lấy từ: GHN Dashboard > Danh sách shop

- **NEXT_PUBLIC_GHN_FROM_DISTRICT_ID**: District ID của kho hàng/shop
  - Mặc định: 1542 (Quận 10, TP.HCM)
  - Lấy từ API: `/province` và `/district`

## Cách lấy Token và Shop ID

1. Đăng nhập vào [GHN Dashboard](https://ghn.vn)
2. Vào **Cài đặt** > **Tài khoản**
3. Tìm mục **Token** và copy token
4. Vào **Danh sách shop** để lấy Shop ID

## Cách lấy District ID

Bạn có thể sử dụng API của GHN để lấy District ID:

```bash
# Get provinces
curl -X GET 'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province' \
  -H 'Token: YOUR_TOKEN'

# Get districts of a province
curl -X GET 'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=202' \
  -H 'Token: YOUR_TOKEN'
```

## Cách hoạt động

1. **Khi người dùng chọn địa chỉ giao hàng**:
   - Component `AddressSection` trigger hook `useCheckout`
   - Hook gọi `updateShippingFromAddress(address)`

2. **Tính phí ship**:
   - `ShippingService.calculateShippingInfo()` gọi 2 API:
     - `/v2/shipping-order/fee` - Tính phí vận chuyển
     - `/v2/shipping-order/leadtime` - Tính thời gian giao hàng
   - Kết quả được lưu vào state `shippingInfo`

3. **Hiển thị kết quả**:
   - `ShippingInfo` component hiển thị phí ship và thời gian
   - `CheckoutSummary` cập nhật tổng tiền với phí ship động

## Components liên quan

### Service Layer

- `src/services/shipping.service.ts` - Service gọi GHN API
- `src/services/address.service.ts` - Service quản lý địa chỉ

### Hooks

- `src/hooks/useCheckout.ts` - Hook quản lý checkout flow, tích hợp tính phí ship

### Components

- `src/components/feature/checkout/AddressSection.tsx` - Hiển thị địa chỉ đã chọn
- `src/components/feature/checkout/ShippingInfo.tsx` - Hiển thị phí ship và thời gian
- `src/components/feature/checkout/CheckoutSummary.tsx` - Tổng kết đơn hàng

### Types

- `src/types/address.ts` - Type definitions cho GHN API

## Xử lý lỗi

Service có các cơ chế xử lý lỗi:

1. **Circuit Breaker**: Ngăn chặn quá nhiều request khi API lỗi
2. **Rate Limiting**: Giới hạn 30 requests/phút
3. **Retry Logic**: Tự động retry khi gặp lỗi mạng
4. **Fallback**: Dùng giá trị mặc định (30,000 VND, 3 ngày) khi API lỗi

## Testing

Để test tính năng:

1. Đảm bảo đã cấu hình đúng biến môi trường
2. Vào trang checkout
3. Chọn một địa chỉ giao hàng
4. Kiểm tra:
   - Loading spinner xuất hiện
   - Phí ship và thời gian được cập nhật
   - Tổng tiền đơn hàng thay đổi theo

## Lưu ý

- **District ID và Ward Code** là bắt buộc để tính phí ship chính xác
- Đảm bảo địa chỉ trong database có lưu `districtId` và `wardCode`
- API GHN có rate limit, nên service đã implement rate limiting
- Sử dụng môi trường **dev** khi phát triển để tránh tính phí thật

## Troubleshooting

### Lỗi "Rate limit exceeded"
- Đợi 1 phút trước khi thử lại
- Kiểm tra xem có quá nhiều request đồng thời không

### Lỗi "Circuit breaker is open"
- API GHN đang gặp vấn đề hoặc quá nhiều lỗi liên tiếp
- Đợi 30 giây để circuit breaker tự động reset

### Phí ship luôn là 30,000 VND
- Kiểm tra địa chỉ có `districtId` và `wardCode` chưa
- Kiểm tra token GHN có hợp lệ không
- Xem log trong console để biết lỗi cụ thể

## Resources

- [GHN API Documentation](https://api.ghn.vn/home/docs/detail)
- [GHN Dashboard](https://ghn.vn)
