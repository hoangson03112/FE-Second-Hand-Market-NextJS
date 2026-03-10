"use client";

import { useParams, useSearchParams } from "next/navigation";
import OrderDetail from "@/features/order-details/OrderDetail";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const id = typeof params.id === "string" ? params.id : params.id?.[0];

  if (!id) return null;

  return (
    <OrderDetail
      orderId={id}
      autoOpenRefund={searchParams.get("refund") === "1"}
      autoOpenReview={searchParams.get("review") === "1"}
    />
  );
}
