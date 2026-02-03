import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCheckoutStore, CheckoutItem } from "@/store/useCheckoutStore";
import { useUser } from "./useUser";
import { PaymentMethodType } from "@/components/feature/checkout/components/PaymentMethod";
import { Address, ShippingServiceOption } from "@/types/address";
import { ShippingService } from "@/services/shipping.service";
import { OrderService, CreateOrderRequest } from "@/services/order.service";
import { logger } from "@/infrastructure/monitoring/logger";
import { useToast } from "@/components/ui";

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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingData, setShippingData] = useState<ShippingData | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [shippingInfo, setShippingInfo] = useState<ShippingServiceOption | null>(null);
  const [shippingInfoBySeller, setShippingInfoBySeller] = useState<
    Record<string, ShippingServiceOption>
  >({});
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);
  const toast = useToast();

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
        setShippingInfo(null);
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
        let totalFee = 0;

        for (const [sellerId, sellerItems] of groups) {
          const seller = sellerItems[0]?.product?.seller;
          const fromDistrictId = seller?.from_district_id
            ? parseInt(seller.from_district_id)
            : NaN;
          const fromWardCode = seller?.from_ward_code ?? "";

          if (isNaN(fromDistrictId) || !fromWardCode) {
            setShippingError(
              `Người bán ${seller?.fullName ?? sellerId} chưa cấu hình địa chỉ gửi hàng.`
            );
            setShippingInfo(null);
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
          totalFee += result.fee ?? 0;
        }

        setShippingInfoBySeller(bySeller);
        setShippingInfo({
          ...Object.values(bySeller)[0],
          fee: totalFee,
        });
        logger.info("Shipping calculated for all sellers", {
          sellerCount: Object.keys(bySeller).length,
          totalFee,
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Không thể tải phương thức vận chuyển";
        logger.error("Error loading shipping services", error as Error);
        setShippingError(message);
        setShippingInfo(null);
        setShippingInfoBySeller({});
      } finally {
        setIsCalculatingShipping(false);
      }
    },
    [account?.email, checkoutItems]
  );

  const orderItems = checkoutItems.map((item) => ({
    id: item.product._id,
    name: item.product.name,
    image: item.product.avatar?.url || "",
    price: item.product.price,
    quantity: item.quantity,
    condition: item.product.condition || "mới",
    seller: {
      name: item.product.seller?.fullName || "Không rõ",
      from_district_id: item.product.seller?.from_district_id || "",
      from_ward_code: item.product.seller?.from_ward_code || "",
    },
  }));

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalShippingFee = Object.values(shippingInfoBySeller).reduce(
    (sum, s) => sum + (s.fee ?? 0),
    0
  );
  const shipping = totalShippingFee;
  const total = subtotal + shipping;

  const handleCheckout = useCallback(async () => {
    if (!shippingData || !selectedAddressId) {
      toast.error("Vui lòng chọn địa chỉ giao hàng");
      return;
    }

    if (Object.keys(shippingInfoBySeller).length === 0) {
      toast.error("Vui lòng đợi tính phí vận chuyển hoàn tất");
      return;
    }

    if (checkoutItems.length === 0) {
      toast.error("Giỏ hàng trống");
      return;
    }

    setIsSubmitting(true);

    try {
      const groups = groupCheckoutItemsBySeller(checkoutItems);
      const orderIds: string[] = [];

      for (const [sellerId, sellerItems] of groups) {
        const shipInfo = shippingInfoBySeller[sellerId];
        if (!shipInfo) {
          throw new Error(
            `Thiếu phí vận chuyển cho người bán. Vui lòng chọn lại địa chỉ.`
          );
        }

        const groupSubtotal = sellerItems.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
        const groupTotal = groupSubtotal + (shipInfo.fee ?? 0);

        const orderData: CreateOrderRequest = {
          products: sellerItems.map((item) => ({
            productId: item.product._id,
            quantity: item.quantity,
          })),
          totalAmount: groupTotal,
          shippingAddress: selectedAddressId,
          shippingMethod: shipInfo.short_name || "GHN",
          sellerId,
          paymentMethod: paymentMethod === "bank_transfer" ? "bank_transfer" : "cod",
          shippingFee: shipInfo.shippingFee ?? shipInfo.fee,
          insuranceFee: shipInfo.insuranceFee ?? 0,
          codFee: shipInfo.codFee ?? 0,
          totalShippingFee: shipInfo.totalShippingFee ?? shipInfo.fee,
          expectedDeliveryTime: shipInfo.expectedDeliveryTime,
        };

        logger.info("Creating order for seller", { sellerId, orderData });
        const response = await OrderService.create(orderData);
        orderIds.push(response.order._id);
      }

      clearCheckout();

      const firstOrderId = orderIds[0];
      if (paymentMethod === "bank_transfer") {
        router.push(`/payment?orderId=${firstOrderId}`);
      } else {
        const idsParam =
          orderIds.length > 1 ? `&orderIds=${orderIds.join(",")}` : "";
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
    paymentMethod,
    checkoutItems,
    clearCheckout,
    router,
    toast,
  ]);

  return {
    orderItems,
    subtotal,
    shipping,
    total,
    shippingInfo,
    isCalculatingShipping,
    shippingError,
    paymentMethod,
    isSubmitting,
    shippingData,
    setPaymentMethod,
    updateShippingFromAddress,
    handleCheckout,
  };
}
