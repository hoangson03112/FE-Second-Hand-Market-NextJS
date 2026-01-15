# UI Components - Toast & ConfirmDialog

## Setup

Wrap your app with the providers in your root layout:

```tsx
// app/layout.tsx
import { ToastProvider, ConfirmDialogProvider } from "@/components/ui";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ToastProvider>
          <ConfirmDialogProvider>
            {children}
          </ConfirmDialogProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
```

## Toast Notifications

### Usage

```tsx
import { useToast } from "@/components/ui";

function MyComponent() {
  const toast = useToast();

  const handleSuccess = () => {
    toast.success("Thao tác thành công!");
  };

  const handleError = () => {
    toast.error("Có lỗi xảy ra!");
  };

  const handleInfo = () => {
    toast.info("Thông tin quan trọng");
  };

  const handleWarning = () => {
    toast.warning("Cảnh báo!");
  };

  // Generic
  const handleCustom = () => {
    toast.showToast("Custom message", "success");
  };

  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
      <button onClick={handleInfo}>Show Info</button>
      <button onClick={handleWarning}>Show Warning</button>
    </div>
  );
}
```

### Features

- ✅ Auto-dismiss after 3 seconds
- ✅ 4 variants: success, error, info, warning
- ✅ Clean animations
- ✅ Manual close button
- ✅ Multiple toasts stacking

## Confirm Dialog

### Usage

```tsx
import { useConfirm } from "@/components/ui";

function MyComponent() {
  const { confirm } = useConfirm();

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "Xóa địa chỉ",
      message: "Bạn có chắc muốn xóa địa chỉ này? Hành động này không thể hoàn tác.",
      confirmText: "Xóa",
      cancelText: "Hủy",
      variant: "danger",
    });

    if (confirmed) {
      // User clicked "Xóa"
      await deleteAddress();
      toast.success("Đã xóa địa chỉ");
    }
  };

  return (
    <button onClick={handleDelete}>Xóa</button>
  );
}
```

### Options

```typescript
interface ConfirmOptions {
  title?: string;           // Default: "Xác nhận"
  message: string;          // Required
  confirmText?: string;     // Default: "Xác nhận"
  cancelText?: string;      // Default: "Hủy"
  variant?: "danger" | "warning" | "info";  // Default: "info"
}
```

### Variants

- **danger** - Red, for destructive actions (delete, remove)
- **warning** - Yellow, for warning actions
- **info** - Blue, for informational confirmations

## Examples

### Delete Confirmation

```tsx
const handleDelete = async () => {
  const confirmed = await confirm({
    title: "Xóa sản phẩm",
    message: "Bạn có chắc muốn xóa sản phẩm này?",
    confirmText: "Xóa",
    variant: "danger",
  });

  if (confirmed) {
    await deleteProduct();
  }
};
```

### Warning Confirmation

```tsx
const handleLogout = async () => {
  const confirmed = await confirm({
    title: "Đăng xuất",
    message: "Bạn có chắc muốn đăng xuất?",
    confirmText: "Đăng xuất",
    variant: "warning",
  });

  if (confirmed) {
    logout();
  }
};
```

### Info Confirmation

```tsx
const handleSubmit = async () => {
  const confirmed = await confirm({
    title: "Xác nhận đơn hàng",
    message: "Bạn có muốn đặt hàng với thông tin này?",
    confirmText: "Đặt hàng",
    variant: "info",
  });

  if (confirmed) {
    submitOrder();
  }
};
```
