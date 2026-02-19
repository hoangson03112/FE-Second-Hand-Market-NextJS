import { Suspense } from "react";
import Payment from "@/components/feature/payment";

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    }>
      <Payment />
    </Suspense>
  );
}
