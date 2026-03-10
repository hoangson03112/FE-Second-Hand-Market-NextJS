import { IconArrowLeft, IconShoppingBag } from "@tabler/icons-react";
import { Container } from "@/components/layout/Container";

interface OrdersHeaderProps {
  onBack: () => void;
}

export function OrdersHeader({ onBack }: OrdersHeaderProps) {
  return (
    <div className="bg-cream-50/95 backdrop-blur-md border-b-2 border-neutral-200/60 sticky top-0 z-10 shadow-sm">
      <Container paddingX="md">
        <div className="py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-cream-50 transition-colors"
          >
            <IconArrowLeft className="h-5 w-5 text-neutral-900" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
              <IconShoppingBag className="w-7 h-7 text-primary" />
              Đơn hàng của tôi
            </h1>
            <p className="text-sm text-neutral-600 mt-0.5">
              Quản lý và theo dõi đơn hàng của bạn
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
