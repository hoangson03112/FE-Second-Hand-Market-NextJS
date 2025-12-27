# 🏗️ Infrastructure Layer

## Mục đích

Thư mục `infrastructure` chứa các **cross-cutting concerns** - những thứ không thuộc về business logic nhưng cần thiết cho toàn bộ ứng dụng:

- **Monitoring & Analytics**: Theo dõi lỗi, performance, user behavior
- **API Clients**: Cấu hình HTTP client, interceptors
- **Caching**: Cache strategies (Redis, Memory, etc.)
- **Storage**: LocalStorage, SessionStorage wrappers
- **Logging**: Centralized logging system
- **Error Handling**: Global error handlers

## Tại sao cần Infrastructure Layer?

### ✅ Lợi ích:

1. **Separation of Concerns**: Tách biệt infrastructure khỏi business logic
2. **Reusability**: Dùng chung cho toàn bộ app
3. **Testability**: Dễ mock và test
4. **Maintainability**: Thay đổi infrastructure không ảnh hưởng business logic
5. **Scalability**: Dễ thêm monitoring, caching, etc.

### 📁 Cấu trúc đề xuất:

```
infrastructure/
├── monitoring/          # Error tracking, analytics
│   ├── sentry.ts
│   ├── analytics.ts
│   └── logger.ts
├── api/                # API clients, interceptors
│   ├── axios-client.ts
│   ├── interceptors.ts
│   └── error-handler.ts
├── cache/              # Caching strategies
│   ├── memory-cache.ts
│   └── storage-cache.ts
├── storage/           # Browser storage
│   ├── localStorage.ts
│   └── sessionStorage.ts
└── utils/             # Infrastructure utilities
    ├── error-boundary.tsx
    └── retry.ts
```

## Cách sử dụng

### Import từ infrastructure

```typescript
// Import tất cả từ một chỗ
import { 
  logger, 
  captureException, 
  trackEvent,
  storage 
} from '@/infrastructure';
```

### 1. Monitoring & Logging

```typescript
import { logger, captureException, trackEvent } from '@/infrastructure';

// Logging với levels
logger.debug('Debug message', { userId: '123' });
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error occurred', error, { context: 'ProductList' });

// Error tracking (Sentry)
try {
  // some code
} catch (error) {
  captureException(error as Error, { context: 'ProductList' });
}

// Analytics tracking
trackEvent('product_viewed', { productId: '123' });
trackPageView('/products');
```

### 2. Storage

```typescript
import { storage, sessionStorage } from '@/infrastructure';

// LocalStorage (persists across sessions)
storage.set('user_preferences', { theme: 'dark' });
const prefs = storage.get('user_preferences');
storage.remove('user_preferences');

// SessionStorage (cleared when tab closes)
sessionStorage.set('temp_data', data);
const temp = sessionStorage.get('temp_data');
```

### 3. API Client

```typescript
// Hiện tại đang dùng axios từ libs/axios.ts
// Nếu muốn dùng infrastructure version:
// import { apiClient } from '@/infrastructure/api/axios-client';

// Tự động có:
// - Request interceptors (add auth token)
// - Response interceptors (error handling)
// - Logging
// - Error tracking
```

## Ví dụ thực tế

### Trong Component

```typescript
'use client';
import { useEffect } from 'react';
import { logger, trackEvent, storage } from '@/infrastructure';

export function ProductCard({ product }) {
  useEffect(() => {
    // Track page view
    trackEvent('product_card_viewed', { productId: product._id });
    
    // Log user action
    logger.userAction('view_product', { productId: product._id });
  }, [product._id]);

  const handleClick = () => {
    // Save to localStorage
    const viewedProducts = storage.get('viewed_products') || [];
    storage.set('viewed_products', [...viewedProducts, product._id]);
    
    // Track event
    trackEvent('product_clicked', { productId: product._id });
  };

  return <div onClick={handleClick}>...</div>;
}
```

### Trong Service/API Call

```typescript
import axiosClient from '@/lib/axios';
import { logger, captureException } from '@/infrastructure';

export const ProductService = {
  async getAll() {
    try {
      logger.apiRequest('GET', '/products');
      const response = await axiosClient.get('/products');
      logger.apiResponse('GET', '/products', 200);
      return response;
    } catch (error) {
      logger.apiResponse('GET', '/products', error.response?.status || 500);
      captureException(error as Error, { context: 'ProductService.getAll' });
      throw error;
    }
  }
};
```

## Best Practices

1. **Không import business logic vào infrastructure**
2. **Infrastructure chỉ phụ thuộc vào external libraries**
3. **Tất cả infrastructure code nên có error handling**
4. **Sử dụng TypeScript để type-safe**
5. **Có thể mock dễ dàng cho testing**

