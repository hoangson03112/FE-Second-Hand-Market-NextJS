/**
 * useCheckoutFlow Hook
 *
 * Custom hook to manage the entire checkout flow logic
 */
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCheckoutStore } from "@/store/useCheckoutStore";
import { useUser } from "./useUser";
import { PaymentMethodType } from "@/components/feature/checkout/PaymentMethod";
import { Address } from "@/types/address";

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

export function useCheckout() {
  const router = useRouter();
  const { items: checkoutItems, clearCheckout } = useCheckoutStore();
  const { data: account } = useUser();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingData, setShippingData] = useState<ShippingData | null>(null);

  const updateShippingFromAddress = useCallback(
    (address: Address) => {
      setShippingData({
        fullName: address.fullName,
        phone: address.phoneNumber,
        email: account?.email || "",
        address: address.address || "",
        province: address.province || "",
        district: address.district || "",
        ward: address.ward || "",
      });
    },
    [account?.email]
  );

  // Convert checkout items to order items format
  const orderItems = checkoutItems.map((item) => ({
    id: item.product._id,
    name: item.product.name,
    image: item.product.avatar?.url || "",
    price: item.product.price,
    quantity: item.quantity,
    condition: item.product.condition || "mới",
    seller: {
      name: item.product.seller.fullName,
      avatar: item.product.seller.avatar,
    },
  }));

  // Calculate totals
  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 30000;
  const total = subtotal + shipping;

  // Handle checkout submission
  const handleCheckout = useCallback(async () => {
    if (!shippingData) {
      alert("Vui lòng điền đầy đủ thông tin giao hàng");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare order data
      const orderData = {
        items: checkoutItems.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        shippingAddress: shippingData,
        paymentMethod,
        subtotal,
        shippingFee: shipping,
        total,
      };

      console.log("Order data:", orderData);

      // TODO: Call API to create order
      // await OrderService.createOrder(orderData);

      // Clear checkout store
      clearCheckout();

      // Redirect to success page
      setTimeout(() => {
        router.push("/order-success");
      }, 1500);
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      alert("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    shippingData,
    paymentMethod,
    checkoutItems,
    subtotal,
    shipping,
    total,
    clearCheckout,
    router,
  ]);

  return {
    // Data
    orderItems,
    subtotal,
    shipping,
    total,
    // State
    paymentMethod,
    isSubmitting,
    shippingData,

    // Actions
    setPaymentMethod,
    updateShippingFromAddress,
    handleCheckout,
  };
}
