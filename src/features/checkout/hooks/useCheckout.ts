import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCheckoutStore, CheckoutItem } from "@/store/useCheckoutStore";
import { useUser } from "@/hooks/useUser";
import { useCart } from "@/hooks/useCart";
import { PaymentMethodType } from "@/features/checkout/components/PaymentMethod";
import { Address, ShippingServiceOption } from "@/types/address";
import { ShippingService } from "@/services/shipping.service";
import { OrderService } from "@/services/order.service";
import type { CreateOrderRequest } from "@/types/order";
import { logger } from "@/infrastructure/monitoring/logger";
import { useToast } from "@/components/ui/Toast";
import { CHECKOUT_MESSAGES } from "@/constants/messages";

export interface SellerGroup {
  sellerId: string;
  sellerName: string;
  sellerAvatar?: string | null;
  items: CheckoutItem[];
  shippingInfo: ShippingServiceOption | null;
  subtotal: number;
  shippingFee: number;
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

export function useCheckout() {
  const router = useRouter();
  const { items: checkoutItems, clearCheckout } = useCheckoutStore();
  const { data: account } = useUser();
  const { removeItems } = useCart();
  const [paymentMethods, setPaymentMethods] = useState<Record<string, PaymentMethodType>>({});
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

  // Reset bank_transfer selection for sellers where it's not available
  useEffect(() => {
    setPaymentMethods((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const [sid, available] of Object.entries(isBankTransferAvailableBySeller)) {
        if (!available && prev[sid] === "bank_transfer") {
          next[sid] = "cod";
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [isBankTransferAvailableBySeller]);

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

      if (!address.districtId || !address.wardCode || checkoutItems.length === 0) {
        setShippingInfoBySeller({});
        return;
      }

      setIsCalculatingShipping(true);
      setShippingError(null);

      try {
        const groups = groupCheckoutItemsBySeller(checkoutItems);
        const toDistrictId = parseInt(address.districtId);
        const toWardCode = address.wardCode;

        if (isNaN(toDistrictId) || !toWardCode) {
          throw new Error("Mã quận/huyện hoặc phường/xã không hợp lệ.");
        }

        const bySeller: Record<string, ShippingServiceOption> = {};

        for (const [sellerId, sellerItems] of groups) {
          const firstProduct = sellerItems[0]?.product;
          const seller = firstProduct?.seller;
          const pickupAddress = firstProduct?.address;
          const fromDistrictId = pickupAddress?.districtId
            ? parseInt(pickupAddress.districtId)
            : seller?.from_district_id
              ? parseInt(seller.from_district_id)
              : NaN;
          const fromWardCode =
            pickupAddress?.wardCode ?? seller?.from_ward_code ?? "";

          if (isNaN(fromDistrictId) || !fromWardCode) {
            setShippingError(
              `Người bán ${seller?.fullName ?? sellerId} chưa cấu hình địa chỉ gửi hàng.`
            );
            setShippingInfoBySeller({});
            setIsCalculatingShipping(false);
            return;
          }

          const weight = sellerItems.reduce((sum, item) => {
            const w = item.product?.estimatedWeight?.value ?? 500;
            return sum + w * item.quantity;
          }, 0);

          const result = await ShippingService.calculateShippingInfo({
            from_district_id: fromDistrictId,
            from_ward_code: fromWardCode,
            to_district_id: toDistrictId,
            to_ward_code: toWardCode,
            weight,
          });

          bySeller[sellerId] = result;
        }

        setShippingInfoBySeller(bySeller);
        logger.info("Shipping calculated for all sellers", {
          sellerCount: Object.keys(bySeller).length,
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Không thể tải phương thức vận chuyển";
        logger.error("Error loading shipping services", error as Error);
        setShippingError(message);
        setShippingInfoBySeller({});
      } finally {
        setIsCalculatingShipping(false);
      }
    },
    [account?.email, checkoutItems]
  );

  // Seller groups enriched with shipping info and subtotals
  const sellerGroups = useMemo<SellerGroup[]>(() => {
    const groups = groupCheckoutItemsBySeller(checkoutItems);
    return Array.from(groups.entries()).map(([sellerId, items]) => {
      const seller = items[0]?.product?.seller;
      const shippingInfo = shippingInfoBySeller[sellerId] ?? null;
      const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
      const shippingFee = shippingInfo?.fee ?? 0;
      return {
        sellerId,
        sellerName: seller?.fullName ?? "Người bán",
        sellerAvatar: seller?.avatar ?? null,
        items,
        shippingInfo,
        subtotal,
        shippingFee,
      };
    });
  }, [checkoutItems, shippingInfoBySeller]);

  const subtotal = sellerGroups.reduce((sum, g) => sum + g.subtotal, 0);
  const shipping = sellerGroups.reduce((sum, g) => sum + g.shippingFee, 0);
  const total = subtotal + shipping;

  const handleCheckout = useCallback(async () => {
    if (!shippingData || !selectedAddressId) {
      toast.error(CHECKOUT_MESSAGES.NO_ADDRESS);
      return;
    }

    if (Object.keys(shippingInfoBySeller).length === 0) {
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
        const { sellerId, items: sellerItems, shippingInfo } = group;
        if (!shippingInfo) {
          throw new Error(`Thiếu phí vận chuyển cho người bán. Vui lòng chọn lại địa chỉ.`);
        }

        const groupTotal = group.subtotal + (shippingInfo.fee ?? 0);
        const method = getPaymentMethodForSeller(sellerId);

        const orderData: CreateOrderRequest = {
          products: sellerItems.map((item) => ({
            productId: item.product._id,
            quantity: item.quantity,
          })),
          totalAmount: groupTotal,
          shippingAddress: selectedAddressId,
          shippingMethod: `GHN - ${shippingInfo.short_name || "Chuẩn"}`,
          sellerId,
          paymentMethod: method,
          shippingFee: shippingInfo.shippingFee ?? shippingInfo.fee,
          insuranceFee: shippingInfo.insuranceFee ?? 0,
          codFee: shippingInfo.codFee ?? 0,
          totalShippingFee: shippingInfo.totalShippingFee ?? shippingInfo.fee,
          expectedDeliveryTime: shippingInfo.expectedDeliveryTime,
        };

        logger.info("Creating order for seller", { sellerId, method, orderData });
        const response = await OrderService.create(orderData);
        allOrderIds.push(response.order._id);
        if (method === "bank_transfer") {
          bankTransferOrderIds.push(response.order._id);
        }
      }

      const productIds = checkoutItems.map((item) => item.product._id);
      await removeItems(productIds);
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
    isCalculatingShipping,
    shippingError,
    paymentMethods,
    setPaymentMethodForSeller,
    getPaymentMethodForSeller,
    isBankTransferAvailableBySeller,
    isSubmitting,
    shippingData,
    updateShippingFromAddress,
    handleCheckout,
  };
}
