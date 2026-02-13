"use client";

import { useParams } from "next/navigation";
import OrderDetail from "@/components/feature/orders/OrderDetail";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const id = typeof params.id === "string" ? params.id : params.id?.[0];

  if (!id) return null;

  return <OrderDetail orderId={id} />;
}
