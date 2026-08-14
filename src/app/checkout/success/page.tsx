import { Suspense } from "react";
import CheckoutSuccess from "@/features/checkout-success/CheckoutSuccess";

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-luxury-ivory">
          <span className="h-4 w-4 animate-spin rounded-full border border-luxury-ink/20 border-t-luxury-ink" />
        </div>
      }
    >
      <CheckoutSuccess />
    </Suspense>
  );
}
