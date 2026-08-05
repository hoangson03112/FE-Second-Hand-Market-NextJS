import {
	IconChevronRight,
	IconCircleCheck,
	IconCircleX,
	IconClock,
	IconLoader2,
	IconMapPin,
	IconMessage,
	IconRefresh,
	IconShoppingBag,
	IconStar,
	IconTruck,
} from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import type { Order } from "@/types/order";
import { formatPrice } from "@/utils/format/price";
import { format } from "@/utils/format/date";
import { formatShippingMethod, getShippingMethodType } from "@/utils/format";
import { openChatWithOrder } from "@/utils/chat";
import { getAvatarUrl } from "@/utils";
import { getRefundStatusNotice } from "@/constants/orderStatus";
import { StatusBadge } from "@/components/shared";
import { AvatarOrInitials } from "@/components/shared/AvatarOrInitials";

interface OrderCardProps {
	order: Order;
	cancellingId: string | null;
	onCancel: (orderId: string) => void;
	confirmingId: string | null;
	onConfirmReceived: (orderId: string) => void;
	onOpenRefund: (orderId: string) => void;
}

const REFUND_RETURN_TRACKING_STATUSES = new Set([
	"refund",
	"returning",
	"return_shipping",
	"returned",
	"refunded",
]);

export function OrderCard({ order, cancellingId, onCancel, confirmingId, onConfirmReceived, onOpenRefund }: OrderCardProps) {
	const isLocalPickup = getShippingMethodType(order.shippingMethod) === "local_pickup";
	const refundNotice = getRefundStatusNotice(order.status, "buyer");
	const showGhnReturnOnCard =
		Boolean(order.ghnReturnOrderCode) && REFUND_RETURN_TRACKING_STATUSES.has(order.status);
	const refundNoticeClass =
		refundNotice?.tone === "success"
			? "border-emerald-200 bg-emerald-50 text-emerald-800"
			: refundNotice?.tone === "warning"
				? "border-amber-200 bg-amber-50 text-amber-800"
				: "border-sky-200 bg-sky-50 text-sky-800";

	return (
		<div className="bg-white rounded-2xl border-2 border-border overflow-hidden hover:border-primary/40 hover:shadow-md transition-all duration-300 group">
			<div className="bg-gradient-to-r from-taupe-50 to-cream-50 px-6 py-4 border-b-2 border-border flex items-center justify-between">
				<div className="flex items-center gap-4 flex-1">
					<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
						<IconShoppingBag className="w-5 h-5 text-primary" />
					</div>
					<div className="flex-1 min-w-0">
						{order.ghnOrderCode ? (
							<p className="font-semibold text-taupe-900 text-sm">
								Mã vận đơn GHN: <span className="font-mono">{order.ghnOrderCode}</span>
							</p>
						) : (
							<p className="font-semibold text-taupe-900 text-sm">
								Mã đơn nội bộ <span className="font-mono text-taupe-400">#{order._id.slice(-8).toUpperCase()}</span>
							</p>
						)}
						<div className="flex items-center gap-2 mt-1">
							<IconClock className="w-3.5 h-3.5 text-taupe-400" />
							<p className="text-xs text-taupe-500 font-medium">{format(order.createdAt)}</p>
						</div>
					</div>
				</div>
				<div className="flex flex-col items-end gap-1.5">
					<StatusBadge status={order.status} />
				</div>
			</div>

			<div className="p-6">
				<div className="space-y-4">
					{order.products?.map((item, idx) => {
						const product = item.productId;
						const productHref = product?._id ? `/products/${product._id}/product` : null;
						const avatar =
							typeof product?.avatar === "string"
								? product.avatar
								: product?.avatar?.url || "/placeholder.svg";

						return (
							<div key={idx} className="flex gap-4 p-3 rounded-xl hover:bg-taupe-50/50 transition-colors">
								{productHref ? (
									<Link
										href={productHref}
										className="w-20 h-20 rounded-xl overflow-hidden bg-taupe-100 shrink-0 ring-1 ring-border hover:ring-primary/50 transition-colors"
									>
										<Image
											src={avatar}
											alt={product?.name || "Sản phẩm"}
											width={80}
											height={80}
											className="w-full h-full object-cover"
										/>
									</Link>
								) : (
									<div className="w-20 h-20 rounded-xl overflow-hidden bg-taupe-100 shrink-0 ring-1 ring-border">
										<Image
											src={avatar}
											alt={product?.name || "Sản phẩm"}
											width={80}
											height={80}
											className="w-full h-full object-cover"
										/>
									</div>
								)}
								<div className="flex-1 min-w-0">
									{productHref ? (
										<Link
											href={productHref}
											className="font-semibold text-taupe-900 line-clamp-2 mb-1 hover:text-primary transition-colors"
										>
											{product?.name || "Sản phẩm"}
										</Link>
									) : (
										<h4 className="font-semibold text-taupe-900 line-clamp-2 mb-1">
											{product?.name || "Sản phẩm"}
										</h4>
									)}
									<p className="text-xs uppercase tracking-wide text-taupe-500 mb-2 font-medium">Số lượng: ×{item.quantity}</p>
									<p className="text-base font-bold text-primary">
										{formatPrice(item.price || product?.price || 0)}
									</p>
								</div>
							</div>
						);
					})}
				</div>

				{order.sellerId && (
					<div className="mt-6 pt-5 border-t-2 border-border flex items-center justify-between">
						<div className="flex items-center gap-3">
							<AvatarOrInitials
								avatar={(order.sellerId as { avatar?: { url?: string } })?.avatar}
								fullName={order.sellerId.fullName}
								size={36}
							/>
							<div>
								<p className="text-[11px] uppercase tracking-[0.15em] font-semibold text-taupe-500">Người bán</p>
								<p className="font-medium text-taupe-900 text-sm mt-0.5">{order.sellerId.fullName || "—"}</p>
							</div>
						</div>
						<button
							onClick={() =>
								openChatWithOrder(
									{
										_id: order.sellerId._id,
										fullName: order.sellerId.fullName,
										avatar: getAvatarUrl((order.sellerId as { avatar?: { url?: string } })?.avatar) ?? undefined,
									},
									{
										_id: order._id,
										status: order.status,
										ghnOrderCode: order.ghnOrderCode,
										products: order.products.map((item) => ({
											name: item.productId?.name || "Sản phẩm",
											quantity: item.quantity,
											price: item.price || item.productId?.price || 0,
										})),
										totalAmount: order.totalAmount,
									}
								)
							}
							className="p-2 rounded-full text-taupe-500 hover:bg-taupe-100 hover:text-primary transition-colors">
							<IconMessage className="w-5 h-5" />
						</button>
					</div>
				)}

				{order.shippingAddress && (
					<div className="mt-4 p-4 bg-taupe-50/60 rounded-xl border border-border/60">
						<div className="flex items-start gap-3">
							<IconMapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
							<div className="flex-1 min-w-0">
								<p className="text-[11px] uppercase tracking-[0.15em] font-semibold text-taupe-500 mb-1">Địa chỉ nhận hàng</p>
								<p className="text-sm font-semibold text-taupe-900">
									{order.shippingAddress.fullName} | {order.shippingAddress.phoneNumber}
								</p>
								<p className="text-sm text-taupe-700 mt-1">{order.shippingAddress.specificAddress}</p>
								{(order.shippingAddress.ward ||
									order.shippingAddress.district ||
									order.shippingAddress.province) && (
									<p className="text-sm text-taupe-700 mt-0.5">
										{[
											order.shippingAddress.ward,
											order.shippingAddress.district,
											order.shippingAddress.province,
										]
											.filter(Boolean)
											.join(", ")}
									</p>
								)}
							</div>
						</div>
					</div>
				)}

				{order.shippingMethod && (
					<div className="mt-4 flex items-center gap-2 text-sm px-1">
						<IconTruck className="w-4 h-4 text-taupe-500" />
						<span className="text-taupe-500">Vận chuyển:</span>
						<span className="font-medium text-taupe-900">{formatShippingMethod(order.shippingMethod)}</span>
					</div>
				)}
				{refundNotice && (
					<div className={`mt-4 rounded-xl border-2 px-4 py-3 ${refundNoticeClass}`}>
						<p className="text-xs font-semibold">{refundNotice.title}</p>
						<p className="mt-1 text-xs">{refundNotice.description}</p>
					</div>
				)}
				{showGhnReturnOnCard && (
					<div className="mt-4 rounded-xl border-2 border-sky-200 bg-sky-50/80 px-4 py-3 text-sky-900">
						<p className="text-xs font-semibold">Vận đơn hoàn trả GHN</p>
						<p className="mt-1 font-mono text-xs">{order.ghnReturnOrderCode}</p>
						{(order.ghnReturnTrackingUrl?.trim() || order.ghnReturnOrderCode) && (
							<a
								href={
									order.ghnReturnTrackingUrl?.trim() ||
									`https://tracking.ghn.dev/?order_code=${order.ghnReturnOrderCode}`
								}
								target="_blank"
								rel="noopener noreferrer"
								className="mt-1.5 inline-block text-xs font-semibold hover:underline"
							>
								Theo dõi vận đơn hoàn →
							</a>
						)}
					</div>
				)}

				<div className="mt-6 pt-5 border-t-2 border-border flex items-center justify-between flex-wrap gap-4">
					<div className="flex flex-col">
						<div className="flex items-baseline gap-2 mb-1">
							<span className="text-[11px] uppercase tracking-wide font-semibold text-taupe-500">Tiền hàng:</span>
							<span className="font-semibold text-taupe-900">{formatPrice(order.productAmount || 0)}</span>
						</div>
						<div className="flex items-baseline gap-2 mb-2">
							<span className="text-[11px] uppercase tracking-wide font-semibold text-taupe-500">Phí vận chuyển:</span>
							<span className="font-semibold text-taupe-900">{formatPrice(order.shippingFee || 0)}</span>
						</div>
						<div className="flex items-baseline gap-2 mt-1">
							<span className="text-xs uppercase tracking-wide font-bold text-taupe-900">Tổng cộng:</span>
							<span className="text-xl font-bold text-primary">{formatPrice(order.totalAmount)}</span>
						</div>
					</div>

					<div className="flex flex-wrap items-center justify-end gap-3">
						{order.status === "delivered" && (
							<button
								onClick={() => onConfirmReceived(order._id)}
								disabled={confirmingId === order._id}
								className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wide hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md flex items-center gap-2"
							>
								{confirmingId === order._id ? (
									<IconLoader2 className="w-4 h-4 animate-spin" />
								) : (
									<IconCircleCheck className="w-4 h-4" />
								)}
								Đã nhận hàng
							</button>
						)}
						{!isLocalPickup && (order.status === "delivered" || order.status === "completed") && (
							<button
								type="button"
								onClick={() => onOpenRefund(order._id)}
								className="px-6 py-2.5 rounded-xl border-2 border-taupe-300/80 text-taupe-700 font-semibold text-xs uppercase tracking-wide hover:bg-taupe-50 hover:border-taupe-500/70 transition-all flex items-center gap-2"
							>
								<IconRefresh className="w-4 h-4" />
								Yêu cầu hoàn
							</button>
						)}
						{order.status === "completed" && (
							<Link
								href={`/orders/${order._id}?review=1`}
								className="px-6 py-2.5 rounded-xl border-2 border-primary/30 text-primary font-semibold text-xs uppercase tracking-wide hover:bg-primary/5 hover:border-primary/60 transition-all flex items-center gap-2"
							>
								<IconStar className="w-4 h-4" />
								Đánh giá
							</Link>
						)}
						{order.status === "pending" && (
							<button
								onClick={() => onCancel(order._id)}
								disabled={cancellingId === order._id}
								className="px-6 py-2.5 rounded-xl border-2 border-red-200 text-red-600 font-semibold text-xs uppercase tracking-wide hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
							>
								{cancellingId === order._id ? (
									<IconLoader2 className="w-4 h-4 animate-spin" />
								) : (
									<IconCircleX className="w-4 h-4" />
								)}
								Hủy đơn
							</button>
						)}
						<Link
							href={`/orders/${order._id}`}
							className="px-8 py-2.5 rounded-xl bg-taupe-900 text-white font-semibold text-xs uppercase tracking-wide hover:bg-taupe-800 transition-all flex items-center gap-2 group/btn"
						>
							<span>Xem chi tiết</span>
							<IconChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}