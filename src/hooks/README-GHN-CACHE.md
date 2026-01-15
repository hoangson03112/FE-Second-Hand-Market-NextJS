# GHN Location Data Caching Strategy

## 🎯 Vấn đề

GHN API có **rate limit**. Nếu call quá nhiều lần sẽ bị chặn:
- ❌ Mỗi lần render lại component → call API
- ❌ Mỗi user chọn province → call districts API
- ❌ Transform address list → call API nhiều lần
- ❌ Dễ bị rate limit và ảnh hưởng UX

## ✅ Giải pháp: React Query Cache

Sử dụng **React Query** để cache data với chiến lược:

```typescript
staleTime: Infinity  // Cache forever - data tỉnh/huyện/xã ít thay đổi
gcTime: Infinity     // Không bao giờ xóa cache
```

### 📦 Architecture

```
┌─────────────────────────────────────────────┐
│         React Query Cache                   │
│  ┌────────────────────────────────────┐    │
│  │ ["ghn", "provinces"]                │    │
│  │   → Cache FOREVER                   │    │
│  └────────────────────────────────────┘    │
│                                             │
│  ┌────────────────────────────────────┐    │
│  │ ["ghn", "districts", provinceId]   │    │
│  │   → Cache per province FOREVER      │    │
│  └────────────────────────────────────┘    │
│                                             │
│  ┌────────────────────────────────────┐    │
│  │ ["ghn", "wards", districtId]       │    │
│  │   → Cache per district FOREVER      │    │
│  └────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

## 🚀 Usage

### 1. Trong React Components (AddressForm)

```tsx
import { useProvinces, useDistricts, useWards } from "@/hooks/useGHNLocation";

function AddressForm() {
  // ✅ Chỉ call API 1 lần, sau đó dùng cache
  const { data: provinces } = useProvinces();
  
  // ✅ Chỉ call API khi chưa có cache cho provinceId này
  const { data: districts } = useDistricts(provinceId);
  
  // ✅ Chỉ call API khi chưa có cache cho districtId này
  const { data: wards } = useWards(districtId);
  
  // Data đã được cache, re-render không gọi API
}
```

### 2. Trong Utils (addressTransform.ts)

```tsx
import { enrichAddresses } from "@/utils/addressTransform";
import { useQueryClient } from "@tanstack/react-query";

function MyComponent() {
  const queryClient = useQueryClient();
  
  // ✅ Sử dụng cached data, không call API thêm
  const enriched = await enrichAddresses(addresses, queryClient);
}
```

## 📊 Cache Flow

### Lần đầu tiên

```
User opens form
  → useProvinces() 
    → Check cache: ❌ Empty
    → Call GHN API (/province)
    → Save to cache ["ghn", "provinces"]
    → Return data

User selects Province (Hà Nội)
  → useDistricts("01")
    → Check cache: ❌ Empty for "01"
    → Call GHN API (/district?province_id=01)
    → Save to cache ["ghn", "districts", "01"]
    → Return data

User selects District (Ba Đình)
  → useWards("001")
    → Check cache: ❌ Empty for "001"
    → Call GHN API (/ward?district_id=001)
    → Save to cache ["ghn", "wards", "001"]
    → Return data
```

### Lần thứ 2 trở đi

```
User opens form
  → useProvinces()
    → Check cache: ✅ HIT
    → Return cached data
    → NO API CALL

User selects Province (Hà Nội) again
  → useDistricts("01")
    → Check cache: ✅ HIT
    → Return cached data
    → NO API CALL

Transform 100 addresses
  → enrichAddresses(addresses, queryClient)
    → All data from cache
    → NO API CALL
```

## 🔥 Performance Benefits

### Before (Không cache)

```
- Fetch 10 addresses → 10 API calls
- User chọn province 3 lần → 3 API calls
- Re-render 5 lần → 25 API calls
─────────────────────────────────
Total: 38 API calls ❌
Risk: Rate limit! 🚫
```

### After (Có cache)

```
- Fetch 10 addresses → 1-3 API calls (lần đầu)
- User chọn province 3 lần → 0 API calls (cached)
- Re-render 5 lần → 0 API calls (cached)
─────────────────────────────────
Total: 1-3 API calls ✅
Risk: No rate limit! 🎉
```

## 📁 Files

```
src/hooks/
├── useGHNLocation.ts          # Cache hooks cho GHN data
└── README-GHN-CACHE.md        # This file

src/utils/
└── addressTransform.ts        # Transform IDs → Names using cache

src/components/feature/checkout/
└── AddressForm.tsx            # Uses cached hooks
```

## 🧪 Testing Cache

### Kiểm tra cache hoạt động:

```tsx
// 1. Mở Chrome DevTools → Network tab
// 2. Open AddressForm
// 3. Check: Chỉ có 1 request đến /province
// 4. Close và open lại form
// 5. Check: Không có request nào! ✅ Cache hoạt động

// Hoặc check trong React Query DevTools
// → Sẽ thấy cached queries với stale: false
```

## 🔄 Clear Cache (Nếu cần)

```tsx
import { useQueryClient } from "@tanstack/react-query";

function AdminPanel() {
  const queryClient = useQueryClient();
  
  const handleClearGHNCache = () => {
    // Clear tất cả GHN cache
    queryClient.removeQueries({ queryKey: ["ghn"] });
    
    // Hoặc clear specific
    queryClient.removeQueries({ queryKey: ["ghn", "provinces"] });
  };
}
```

## ⚠️ Notes

- **staleTime: Infinity** - Data tỉnh/huyện/xã ít khi thay đổi, cache forever là OK
- **Nếu GHN thêm tỉnh/huyện mới** - User chỉ cần refresh trang
- **Nếu cần update thường xuyên** - Đổi `staleTime: Infinity` thành `staleTime: 1000 * 60 * 60 * 24` (24h)

## 🎉 Summary

✅ **Giảm 95% API calls đến GHN**  
✅ **Tránh rate limit**  
✅ **UX mượt mà hơn (instant load)**  
✅ **Giảm bandwidth**  
✅ **Code đơn giản, dễ maintain**
