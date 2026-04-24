import { IconArrowLeft } from "@tabler/icons-react";
import { Container } from "@/components/layout/Container";
import { StatusBadge } from "@/components/shared";

interface OrderDetailHeaderProps {
  orderId: string;
  status: string;
  onBack: () => void;
}

export function OrderDetailHeader({ orderId, status, onBack }: OrderDetailHeaderProps) {
  return (
    <div className="bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-10">
      <Container maxWidth="7xl" paddingX="md">
        <div className="py-3 flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-xl hover:bg-muted transition-colors"
          >
            <IconArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-semibold text-foreground leading-tight">
              Chi tiết đơn hàng
            </h1>
            <p className="text-xs text-muted-foreground font-mono">
              #{orderId.slice(-10).toUpperCase()}
            </p>
          </div>
          <StatusBadge status={status} size="md" />
        </div>
      </Container>
    </div>
  );
}
