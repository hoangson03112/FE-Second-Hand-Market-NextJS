"use client";

import { useParams } from "next/navigation";
import SellerOrderDetail from "@/features/seller-order-detail/SellerOrderDetail";

export default function SellerOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const id = typeof params.id === "string" ? params.id : params.id?.[0];
  if (!id) return null;
  return <SellerOrderDetail orderId={id} />;
}
