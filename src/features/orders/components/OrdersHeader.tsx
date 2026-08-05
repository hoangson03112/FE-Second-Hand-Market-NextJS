import { IconArrowLeft, IconShoppingBag } from "@tabler/icons-react";
import { Container } from "@/components/layout/Container";

interface OrdersHeaderProps {
  onBack: () => void;
}

export function OrdersHeader({ onBack }: OrdersHeaderProps) {
  return (
    <div className="bg-cream-50/95 backdrop-blur-md border-b-2 border-border sticky top-0 z-10">
      <Container maxWidth="9xl" paddingX="md" paddingY="none">
        <div className="py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full text-taupe-500 hover:bg-taupe-100 hover:text-taupe-900 transition-colors"
          >
            <IconArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1 flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
              <IconShoppingBag className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-taupe-900 leading-tight">
                Đơn hàng của tôi
              </h1>
              <p className="text-xs text-taupe-500 font-medium uppercase tracking-[0.15em] mt-0.5">
                Quản lý và theo dõi đơn hàng của bạn
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}