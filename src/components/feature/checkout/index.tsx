"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import ShippingForm from "./ShippingForm";
import PaymentMethod, { PaymentMethodType } from "./PaymentMethod";
import OrderItems from "./OrderItems";
import CheckoutSummary from "./CheckoutSummary";

interface ShippingData {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  note?: string;
}

export default function CheckOutPage() {
  const router = useRouter();
  // const searchParams = useSearchParams(); // TODO: Use for cart items
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data - would come from cart or product page
  const mockItems = [
    {
      id: "1",
      name: "iPhone 13 Pro Max 256GB - Đã qua sử dụng",
      image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400",
      price: 18500000,
      quantity: 1,
      condition: "Đã sử dụng",
    },
  ];

  const subtotal = mockItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0; // Free shipping
  const discount = 0;

  const handleShippingSubmit = (data: ShippingData) => {
    console.log("Shipping data:", data);
  };

  const handleCheckout = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Order placed with payment method:", paymentMethod);
      setIsSubmitting(false);
      router.push("/order-success");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-primary hover:underline mb-8 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <ShoppingBag className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Xác Nhận Đơn Hàng</h1>
            <p className="text-muted-foreground">Kiểm tra thông tin trước khi thanh toán</p>
          </div>
        </div>

        {/* Main Content - 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Form */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-border p-6">
              <ShippingForm onSubmit={handleShippingSubmit} />
            </div>

            {/* Payment Method */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-border p-6">
              <PaymentMethod selected={paymentMethod} onSelect={setPaymentMethod} />
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Order Items */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-border p-6">
                <OrderItems items={mockItems} />
              </div>

              {/* Summary */}
              <CheckoutSummary subtotal={subtotal} shipping={shipping} discount={discount} />

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="w-full btn btn-primary btn-lg py-4 text-lg font-bold shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Đang xử lý...
                  </span>
                ) : (
                  `Đặt hàng - ${subtotal > 0 ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal + shipping - discount) : "0₫"}`
                )}
              </button>

              {/* Trust Badges */}
              <div className="bg-muted/50 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Đảm bảo hoàn tiền 100%</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Thanh toán an toàn & bảo mật</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Hỗ trợ 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
