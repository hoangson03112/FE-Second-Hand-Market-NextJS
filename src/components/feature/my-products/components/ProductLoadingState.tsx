import { PRODUCT_MESSAGES } from "@/constants";

export function ProductLoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      <p className="text-sm text-gray-500 mt-4">
        Đang tải...
      </p>
    </div>
  );
}
