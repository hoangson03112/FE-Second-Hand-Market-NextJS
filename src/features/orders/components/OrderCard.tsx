import {
	IconChevronRight,
	IconCircleCheck,
	IconCircleX,
	IconClock,
	IconLoader2,
	IconMapPin,
	IconMessage,
	IconPackage,
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
import { formatShippingMethod } from "@/utils/format";
import { openChatWithOrder } from "@/utils/chat";
import { STATUS_CONFIG } from "@/constants/orderStatus";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface OrderCardProps {
	order: Order;
	cancellingId: string | null;
	onCancel: (orderId: string) => void;
	confirmingId: string | null;
	onConfirmReceived: (orderId: string) => void;
	onOpenRefund: (orderId: string) => void;
}

export function OrderCard({ order, cancellingId, onCancel, confirmingId, onConfirmReceived, onOpenRefund }: OrderCardProps) {

console.log(order);

	return (
		<div className="bg-cream-50/90 backdrop-blur-md rounded-3xl border-2 border-neutral-200/60 shadow-lg shadow-neutral-200/50 overflow-hidden hover:shadow-xl hover:shadow-neutral-200/60 transition-all duration-300 group">
			<div className="bg-cream-50/50 px-5 py-4 border-b-2 border-neutral-200/60 flex items-center justify-between">
				<div className="flex items-center gap-3 flex-1">
					<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
						<IconShoppingBag className="w-5 h-5 text-primary" />
					</div>
					<div className="flex-1 min-w-0">
						{order.ghnOrderCode ? (
							<p className="font-semibold text-neutral-900 text-sm">
								Mã vận đơn GHN: <span className="font-mono">{order.ghnOrderCode}</span>
							</p>
						) : (
							<p className="font-semibold text-neutral-900 text-sm">
								Mã đơn nội bộ <span className="font-mono text-neutral-500">#{order._id.slice(-8).toUpperCase()}</span>
							</p>
						)}
						<div className="flex items-center gap-2 mt-0.5">
							<IconClock className="w-3.5 h-3.5 text-neutral-500" />
							<p className="text-xs text-neutral-600">{format(order.createdAt)}</p>
						</div>
					</div>
				</div>
				<StatusBadge status={order.status} />
			</div>

			<div className="p-5">
				<div className="space-y-3">
					{order.products?.map((item, idx) => {
						const product = item.productId;
						const avatar =
							typeof product?.avatar === "string"
								? product.avatar
								: product?.avatar?.url || "/placeholder.svg";

						return (
							<div key={idx} className="flex gap-4 p-3 rounded-2xl hover:bg-cream-50/50 transition-colors">
								<div className="w-20 h-20 rounded-xl overflow-hidden bg-neutral-100 shrink-0 ring-1 ring-neutral-200">
									<Image
										src={avatar}
										alt={product?.name || "Sản phẩm"}
										width={80}
										height={80}
										className="w-full h-full object-cover"
									/>
								</div>
								<div className="flex-1 min-w-0">
									<h4 className="font-semibold text-neutral-900 line-clamp-2 mb-1">
										{product?.name || "Sản phẩm"}
									</h4>
									<p className="text-sm text-neutral-600 mb-2">Số lượng: ×{item.quantity}</p>
									<p className="text-base font-bold text-primary">
										{formatPrice(item.price || product?.price || 0)}
									</p>
								</div>
							</div>
						);
					})}
				</div>

				{order.sellerId && (
					<div className="mt-4 pt-4 border-t-2 border-neutral-200/60 flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
								<IconPackage className="w-4 h-4 text-primary" />
							</div>
							<div>
								<p className="text-xs text-neutral-600">Người bán</p>
								<p className="font-medium text-neutral-900 text-sm">{order.sellerId.fullName || "—"}</p>
							</div>
						</div>
						<button
							onClick={() =>
								openChatWithOrder(
									{
										_id: order.sellerId._id,
										fullName: order.sellerId.fullName,
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
							className="p-2 rounded-full hover:bg-cream-50 transition-colors group/chat">
							<IconMessage className="w-5 h-5 text-neutral-600 group-hover/chat:text-primary transition-colors" />
						</button>
					</div>
				)}

				{order.shippingAddress && (
					<div className="mt-3 p-3 bg-blue-50/50 rounded-xl border border-blue-200/50">
						<div className="flex items-start gap-2">
							<IconMapPin className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
							<div className="flex-1 min-w-0">
								<p className="text-xs text-blue-800 font-medium mb-1">Địa chỉ nhận hàng</p>
								<p className="text-sm font-semibold text-neutral-900">
									{order.shippingAddress.fullName} | {order.shippingAddress.phoneNumber}
								</p>
								<p className="text-sm text-neutral-700 mt-0.5">{order.shippingAddress.specificAddress}</p>
								{(order.shippingAddress.ward ||
									order.shippingAddress.district ||
									order.shippingAddress.province) && (
									<p className="text-sm text-neutral-600 mt-0.5">
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
					<div className="mt-3 flex items-center gap-2 text-sm">
						<IconTruck className="w-4 h-4 text-neutral-600" />
						<span className="text-neutral-600">Vận chuyển:</span>
						<span className="font-medium text-neutral-900">{formatShippingMethod(order.shippingMethod)}</span>
					</div>
				)}

				<div className="mt-4 pt-4 border-t-2 border-neutral-200/60 flex items-center justify-between">
					<div className="flex flex-col">
						<div className="flex items-baseline gap-2 mb-1">
							<span className="text-sm text-neutral-600">Tiền hàng:</span>
							<span className="font-semibold text-neutral-900">{formatPrice(order.productAmount || 0)}</span>
						</div>
						<div className="flex items-baseline gap-2 mb-2">
							<span className="text-sm text-neutral-600">Phí vận chuyển:</span>
							<span className="font-semibold text-neutral-900">{formatPrice(order.shippingFee || 0)}</span>
						</div>
						<div className="flex items-baseline gap-2">
							<span className="text-base font-bold text-neutral-900">Tổng cộng:</span>
							<span className="text-xl font-bold text-primary">{formatPrice(order.totalAmount)}</span>
						</div>
					</div>

					<div className="flex flex-wrap items-center justify-end gap-2">
						{order.status === "delivered" && (
							<button
								onClick={() => onConfirmReceived(order._id)}
								disabled={confirmingId === order._id}
								className="px-4 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 shadow-sm hover:shadow-md"
							>
								{confirmingId === order._id ? (
									<IconLoader2 className="w-4 h-4 animate-spin" />
								) : (
									<IconCircleCheck className="w-4 h-4" />
								)}
								Đã nhận hàng
							</button>
						)}
						{(order.status === "delivered" || order.status === "completed") && (
							<button
								type="button"
								onClick={() => onOpenRefund(order._id)}
								className="px-4 py-2.5 rounded-full border-2 border-orange-300 text-orange-600 font-semibold text-sm hover:bg-orange-50 transition-all flex items-center gap-1.5"
							>
								<IconRefresh className="w-4 h-4" />
								Yêu cầu hoàn
							</button>
						)}
						{order.status === "completed" && (
							<Link
								href={`/orders/${order._id}?review=1`}
								className="px-4 py-2.5 rounded-full border-2 border-primary/30 text-primary font-semibold text-sm hover:bg-primary/5 transition-all flex items-center gap-1.5"
							>
								<IconStar className="w-4 h-4" />
								Đánh giá
							</Link>
						)}
						{order.status === "pending" && (
							<button
								onClick={() => onCancel(order._id)}
								disabled={cancellingId === order._id}
								className="px-4 py-2.5 rounded-full border-2 border-destructive/40 text-destructive font-semibold text-sm hover:bg-destructive/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
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
							className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-2 group/btn"
						>
							<span>Xem chi tiết</span>
							<IconChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

