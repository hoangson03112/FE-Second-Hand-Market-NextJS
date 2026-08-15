import { OrderStatusBadge } from "@/features/order/components";
import { IconArrowLeft } from "@tabler/icons-react";
import { Container } from "@/components/layout/Container";
import {
} from "@/components/ui";

interface OrderDetailHeaderProps {
  orderId: string;
  status: string;
  onBack: () => void;
}

export function OrderDetailHeader({
  orderId,
  status,
  onBack,
}: OrderDetailHeaderProps) {
  return (
    <div className="sticky top-0 z-10 border-b border-luxury-ink/8 bg-luxury-ivory/95 backdrop-blur-md">
      <Container maxWidth="8xl" paddingX="md">
        <div className="flex items-center gap-3 py-3.5">
          <button
            onClick={onBack}
            className="group -ml-1.5 flex h-8 w-8 items-center justify-center text-taupe-400 transition-colors hover:text-luxury-ink"
          >
            <IconArrowLeft
              className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
              strokeWidth={1.75}
            />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-[13px] font-bold uppercase tracking-[0.1em] text-luxury-ink">
              Chi tiết đơn hàng
            </h1>
            <p className="font-mono text-xs text-taupe-400">
              #{orderId.slice(-10).toUpperCase()}
            </p>
          </div>
          <OrderStatusBadge status={status} size="md" />
        </div>
      </Container>
    </div>
  );
}
