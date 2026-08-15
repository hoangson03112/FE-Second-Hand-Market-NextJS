import OrderDetail from "@/features/order/detail/OrderDetail";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function OrderDetailPage({
  params,
  searchParams,
}: OrderDetailPageProps) {
  const { id } = await params;
  const query = await searchParams;

  return (
    <OrderDetail
      orderId={id}
      autoOpenReview={query.review === "1"}
      autoOpenRefund={query.refund === "1"}
    />
  );
}
