import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCheckoutStore, CheckoutItem } from "@/store/useCheckoutStore";
import { useUser } from "@/features/auth/hooks/useUser";
import { useCart } from "@/hooks/useCart";
import { PaymentMethodType } from "@/features/order/checkout/components/PaymentMethod";
import { Address, ShippingServiceOption } from "@/types/address";
import {
  ShippingService,
  type ShipmentQuoteRequest,
} from "@/services/shipping.service";
import { OrderService } from "@/services/order.service";
import type { CreateOrderRequest } from "@/types/order";
import { logger } from "@/infrastructure/monitoring/logger";
import { useToast } from "@/components/ui";
import { CHECKOUT_MESSAGES } from "@/constants/messages";
import { getAvatarUrl } from "@/utils";

export interface SellerGroup {
  sellerId: string;
  sellerName: string;
  sellerAvatar?: string | null;
  items: CheckoutItem[];
  shippingInfo: ShippingServiceOption | null;
  subtotal: number;
  shippingFee: number;
  isLocalPickup: boolean;
  canLocalPickup: boolean;
  canCodShipping: boolean;
  hasBothOptions: boolean;
}

interface ShippingData {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  province: string;
  district: string;
  ward: string;
  note?: string;
}

function groupCheckoutItemsBySeller(
  items: CheckoutItem[]
): Map<string, CheckoutItem[]> {
  const map = new Map<string, CheckoutItem[]>();
  for (const item of items) {
    const sellerId = item.product?.seller?._id ?? "unknown";
    if (!map.has(sellerId)) map.set(sellerId, []);
    map.get(sellerId)!.push(item);
  }
  return map;
}

/** Nhóm có thể giao COD khi TẤT CẢ sản phẩm hỗ trợ codShipping */
function canGroupCodShip(items: CheckoutItem[]): boolean {
  return items.every((item) => item.product.deliveryOptions?.codShipping === true);
}

/** Nhóm có thể giao trực tiếp khi TẤT CẢ sản phẩm hỗ trợ localPickup */
function canGroupLocalPickup(items: CheckoutItem[]): boolean {
  return items.every((item) => item.product.deliveryOptions?.localPickup !== false);
}

/** Gộp lỗi từng người bán thành một dòng đọc được, không nuốt seller nào. */
function formatShippingErrors(
  errors: Record<string, string>,
  sellerNames: Record<string, string>
): string | null {
  const entries = Object.entries(errors);
  if (entries.length === 0) return null;
  return entries
    .map(([sellerId, message]) => `${sellerNames[sellerId] ?? "Người bán"}: ${message}`)
    .join(" ");
}

export function useCheckout() {
  const router = useRouter();
  const { items: checkoutItems, source: checkoutSource, clearCheckout } = useCheckoutStore();
  const { data: account } = useUser();
  const { removeItems } = useCart();
  const [paymentMethods, setPaymentMethods] = useState<Record<string, PaymentMethodType>>({});
  const [deliveryMethodBySeller, setDeliveryMethodBySeller] = useState<Record<string, "local_pickup" | "cod_shipping">>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingData, setShippingData] = useState<ShippingData | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [shippingInfoBySeller, setShippingInfoBySeller] = useState<
    Record<string, ShippingServiceOption>
  >({});
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);
  const toast = useToast();

  // Per-seller bank transfer availability
  const isBankTransferAvailableBySeller = useMemo<Record<string, boolean>>(() => {
    const result: Record<string, boolean> = {};
    const groups = groupCheckoutItemsBySeller(checkoutItems);
    for (const [sid, items] of groups) {
      result[sid] = items.every((item) => item.product.seller?.role === "seller");
    }
    return result;
  }, [checkoutItems]);

  /** Trả về method đã chọn, fallback theo capability */
  const resolveDeliveryMethod = useCallback(
    (sellerId: string, canCod: boolean, canPickup: boolean): "local_pickup" | "cod_shipping" => {
      if (deliveryMethodBySeller[sellerId]) return deliveryMethodBySeller[sellerId];
      if (canCod && canPickup) return "cod_shipping"; // default khi có cả 2
      if (!canPickup) return "cod_shipping";
      return "local_pickup";
    },
    [deliveryMethodBySeller]
  );

  // Reset bank_transfer when not available or when delivery is local_pickup (gặp mặt trực tiếp)
  const effectiveDeliveryBySeller = useMemo(() => {
    const groups = groupCheckoutItemsBySeller(checkoutItems);
    const out: Record<string, "local_pickup" | "cod_shipping"> = {};
    for (const [sid, items] of groups) {
      const canCod = canGroupCodShip(items);
      const canPickup = canGroupLocalPickup(items);
      out[sid] = resolveDeliveryMethod(sid, canCod, canPickup);
    }
    return out;
  }, [checkoutItems, resolveDeliveryMethod]);

  useEffect(() => {
    setPaymentMethods((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const [sid, available] of Object.entries(isBankTransferAvailableBySeller)) {
        const isLocalPickup = effectiveDeliveryBySeller[sid] === "local_pickup";
        const mustBeCod = !available || isLocalPickup;
        if (mustBeCod && prev[sid] === "bank_transfer") {
          next[sid] = "cod";
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [isBankTransferAvailableBySeller, effectiveDeliveryBySeller]);

  const setPaymentMethodForSeller = useCallback(
    (sellerId: string, method: PaymentMethodType) => {
      setPaymentMethods((prev) => ({ ...prev, [sellerId]: method }));
    },
    []
  );

  const getPaymentMethodForSeller = useCallback(
    (sellerId: string): PaymentMethodType => paymentMethods[sellerId] ?? "cod",
    [paymentMethods]
  );

  const setDeliveryMethodForSeller = useCallback(
    (sellerId: string, method: "local_pickup" | "cod_shipping") => {
      setDeliveryMethodBySeller((prev) => ({ ...prev, [sellerId]: method }));
    },
    []
  );

  // Chỉ huỷ/bỏ qua được request cũ nếu giữ được controller và "chữ ký" của lần
  // tính gần nhất giữa các render.
  const quoteAbortRef = useRef<AbortController | null>(null);
  const quoteKeyRef = useRef<string | null>(null);

  useEffect(() => () => quoteAbortRef.current?.abort(), []);

  const updateShippingFromAddress = useCallback(
    async (address: Address) => {
      setSelectedAddressId(address._id);
      setShippingData({
        fullName: address.fullName,
        phone: address.phoneNumber,
        email: account?.email || "",
        address: address.address || "",
        province: address.province || "",
        district: address.district || "",
        ward: address.ward || "",
      });

      const toDistrictId = parseInt(address.districtId ?? "", 10);
      const toWardCode = address.wardCode ?? "";

      if (!Number.isFinite(toDistrictId) || !toWardCode || checkoutItems.length === 0) {
        quoteAbortRef.current?.abort();
        quoteKeyRef.current = null;
        setShippingInfoBySeller({});
        setShippingError(null);
        return;
      }

      const groups = groupCheckoutItemsBySeller(checkoutItems);
      const shipments: ShipmentQuoteRequest[] = [];
      const sellerNames: Record<string, string> = {};
      const localErrors: Record<string, string> = {};

      for (const [sellerId, sellerItems] of groups) {
        // Chỉ tính GHN cho seller có thể ship COD
        if (!canGroupCodShip(sellerItems)) continue;

        const firstProduct = sellerItems[0]?.product;
        const seller = firstProduct?.seller;
        sellerNames[sellerId] = seller?.fullName ?? "Người bán";

        const pickupAddress = firstProduct?.address;
        const fromDistrictId = parseInt(
          pickupAddress?.districtId ?? seller?.from_district_id ?? "",
          10
        );
        const fromWardCode =
          pickupAddress?.wardCode ?? seller?.from_ward_code ?? "";

        // Địa chỉ gửi hàng hỏng là lỗi của riêng seller đó — các seller còn lại
        // vẫn phải được báo giá bình thường.
        if (!Number.isFinite(fromDistrictId) || !fromWardCode) {
          localErrors[sellerId] = "chưa cấu hình địa chỉ gửi hàng.";
          continue;
        }

        shipments.push({
          id: sellerId,
          from_district_id: fromDistrictId,
          from_ward_code: fromWardCode,
          weight: sellerItems.reduce(
            (sum, item) =>
              sum + (item.product?.estimatedWeight?.value ?? 500) * item.quantity,
            0
          ),
        });
      }

      // Effect gọi hàm này chạy lại mỗi khi `selectedAddress` đổi identity; báo
      // giá lại một giỏ hàng + địa chỉ không đổi chỉ tốn thêm độ trễ.
      const quoteKey = JSON.stringify({ toDistrictId, toWardCode, shipments });
      if (quoteKey === quoteKeyRef.current) return;

      quoteAbortRef.current?.abort();

      if (shipments.length === 0) {
        quoteKeyRef.current = quoteKey;
        setShippingInfoBySeller({});
        setShippingError(formatShippingErrors(localErrors, sellerNames));
        return;
      }

      const controller = new AbortController();
      quoteAbortRef.current = controller;
      // Đặt trước khi await để một lần gọi trùng lúc đang bay không bắn thêm request.
      quoteKeyRef.current = quoteKey;

      setIsCalculatingShipping(true);
      setShippingError(null);

      try {
        const { options, errors } = await ShippingService.quoteShipments({
          to_district_id: toDistrictId,
          to_ward_code: toWardCode,
          shipments,
          signal: controller.signal,
        });

        // Địa chỉ đã đổi trong lúc chờ — kết quả này đã cũ, lần gọi mới đang giữ state.
        if (controller.signal.aborted) return;

        setShippingInfoBySeller(options);
        setShippingError(
          formatShippingErrors({ ...localErrors, ...errors }, sellerNames)
        );
      } catch (error) {
        if (controller.signal.aborted) return;
        const message =
          error instanceof Error ? error.message : "Không thể tải phương thức vận chuyển";
        logger.error("Error loading shipping services", error as Error);
        quoteKeyRef.current = null;
        setShippingError(message);
        setShippingInfoBySeller({});
      } finally {
        if (!controller.signal.aborted) setIsCalculatingShipping(false);
      }
    },
    [account?.email, checkoutItems]
  );

  // Seller groups enriched with shipping info and subtotals
  const sellerGroups = useMemo<SellerGroup[]>(() => {
    const groups = groupCheckoutItemsBySeller(checkoutItems);
    return Array.from(groups.entries()).map(([sellerId, items]) => {
      const seller = items[0]?.product?.seller;
      const canCodShipping = canGroupCodShip(items);
      const canLocalPickup = canGroupLocalPickup(items);
      const hasBothOptions = canCodShipping && canLocalPickup;
      const resolvedMethod = resolveDeliveryMethod(sellerId, canCodShipping, canLocalPickup);
      const isLocalPickup = resolvedMethod === "local_pickup";
      const shippingInfo = shippingInfoBySeller[sellerId] ?? null;
      const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
      const shippingFee = isLocalPickup ? 0 : (shippingInfo?.fee ?? 0);
      return {
        sellerId,
        sellerName: seller?.fullName ?? "Người bán",
        sellerAvatar: getAvatarUrl(seller?.avatar as { url?: string }) ?? null,
        items,
        shippingInfo,
        subtotal,
        shippingFee,
        isLocalPickup,
        canLocalPickup,
        canCodShipping,
        hasBothOptions,
      };
    });
  }, [checkoutItems, shippingInfoBySeller, resolveDeliveryMethod]);

  const subtotal = sellerGroups.reduce((sum, g) => sum + g.subtotal, 0);
  const shipping = sellerGroups.reduce((sum, g) => sum + g.shippingFee, 0);
  const total = subtotal + shipping;
  const allLocalPickup = sellerGroups.length > 0 && sellerGroups.every((g) => g.isLocalPickup);

  const handleCheckout = useCallback(async () => {
    if (!allLocalPickup && (!shippingData || !selectedAddressId)) {
      toast.error(CHECKOUT_MESSAGES.NO_ADDRESS);
      return;
    }

    const hasGhnGroups = sellerGroups.some((g) => !g.isLocalPickup);
    if (hasGhnGroups && Object.keys(shippingInfoBySeller).length === 0) {
      toast.error(CHECKOUT_MESSAGES.SHIPPING_LOADING);
      return;
    }

    if (checkoutItems.length === 0) {
      toast.error(CHECKOUT_MESSAGES.CART_EMPTY);
      return;
    }

    setIsSubmitting(true);

    try {
      const bankTransferOrderIds: string[] = [];
      const allOrderIds: string[] = [];

      for (const group of sellerGroups) {
        const { sellerId, items: sellerItems, shippingInfo, isLocalPickup } = group;
        const payMethod = getPaymentMethodForSeller(sellerId);
        let orderData: CreateOrderRequest;

        if (isLocalPickup) {
          orderData = {
            products: sellerItems.map((item) => ({
              productId: item.product._id,
              quantity: item.quantity,
            })),
            totalAmount: group.subtotal,
            shippingAddress: selectedAddressId ?? "",
            shippingMethod: "local_pickup",
            sellerId,
            paymentMethod: payMethod,
            shippingFee: 0,
            totalShippingFee: 0,
          };
        } else {
          if (!shippingInfo) {
            throw new Error(`Thiếu phí vận chuyển cho người bán. Vui lòng chọn lại địa chỉ.`);
          }
          const groupTotal = group.subtotal + (shippingInfo.fee ?? 0);
          orderData = {
            products: sellerItems.map((item) => ({
              productId: item.product._id,
              quantity: item.quantity,
            })),
            totalAmount: groupTotal,
            shippingAddress: selectedAddressId ?? "",
            shippingMethod: `GHN - ${shippingInfo.short_name || "Chuẩn"}`,
            sellerId,
            paymentMethod: payMethod,
            shippingFee: shippingInfo.shippingFee ?? shippingInfo.fee,
            insuranceFee: shippingInfo.insuranceFee ?? 0,
            codFee: shippingInfo.codFee ?? 0,
            totalShippingFee: shippingInfo.totalShippingFee ?? shippingInfo.fee,
            expectedDeliveryTime: shippingInfo.expectedDeliveryTime,
          };
        }

        logger.info("Creating order for seller", { sellerId, payMethod, orderData });
        const response = await OrderService.create(orderData);
        allOrderIds.push(response.order._id);
        if (payMethod === "bank_transfer") {
          bankTransferOrderIds.push(response.order._id);
        }
      }

      const productIds = checkoutItems.map((item) => item.product._id);
      if (checkoutSource === "cart" && productIds.length > 0) {
        try {
          await removeItems(productIds);
        } catch (error) {
          // Cart cleanup failure should not block a successfully created order.
          logger.warn("Failed to sync cart items after checkout", {
            productIds,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }
      clearCheckout();

      if (bankTransferOrderIds.length > 0) {
        // Redirect to payment for first bank transfer order
        router.push(`/payment?orderId=${bankTransferOrderIds[0]}`);
      } else {
        const firstOrderId = allOrderIds[0];
        const idsParam =
          allOrderIds.length > 1 ? `&orderIds=${allOrderIds.join(",")}` : "";
        router.push(`/checkout/success?orderId=${firstOrderId}${idsParam}`);
      }
    } catch (error) {
      logger.error("Failed to create order", error as Error);
      const message =
        error instanceof Error
          ? error.message
          : "Không thể tạo đơn hàng. Vui lòng thử lại.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    shippingData,
    selectedAddressId,
    shippingInfoBySeller,
    sellerGroups,
    getPaymentMethodForSeller,
    checkoutItems,
    removeItems,
    clearCheckout,
    router,
    toast,
  ]);

  return {
    sellerGroups,
    subtotal,
    shipping,
    total,
    allLocalPickup,
    isCalculatingShipping,
    shippingError,
    paymentMethods,
    setPaymentMethodForSeller,
    getPaymentMethodForSeller,
    setDeliveryMethodForSeller,
    deliveryMethodBySeller,
    isBankTransferAvailableBySeller,
    isSubmitting,
    shippingData,
    updateShippingFromAddress,
    handleCheckout,
  };
}
