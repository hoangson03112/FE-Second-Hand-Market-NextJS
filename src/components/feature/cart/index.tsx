"use client";

import { useRouter } from "next/navigation";
import CartHeader from "./components/CartHeader";
import ShopCartGroup from "./components/ShopCartGroup";
import CartBottomBar from "./components/CartBottomBar";
import CartEmpty from "./components/CartEmpty";
import CartLoginPrompt from "./components/CartLoginPrompt";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useCartPage } from "@/hooks/useCartPage";
import { useTokenStore } from "@/store/useTokenStore";

export default function Cart() {
  const router = useRouter();
  const accessToken = useTokenStore((state) => state.accessToken);
  const {
    cartItems,
    groups,
    itemCount,
    selectedIds,
    selectedCount,
    selectedSubtotal,
    allSelected,
    isLoadingCart,
    isBusy,
    isGoingToCheckout,
    updateQuantity,
    handleToggle,
    handleSelectAll,
    handleSelectAllInShop,
    handleRemoveItem,
    handleGoToCheckout,
  } = useCartPage();

  const onBack = () => router.back();

  if (!accessToken) {
    return (
      <div className="min-h-screen bg-background">
        <CartHeader onBack={onBack} />
        <main className="max-w-4xl mx-auto px-4 pb-8 pt-4">
          <CartLoginPrompt />
        </main>
      </div>
    );
  }

  if (isLoadingCart) {
    return (
      <div className="min-h-screen bg-background">
        <CartHeader onBack={onBack} />
        <main className="max-w-4xl mx-auto px-4 py-12 flex items-center justify-center min-h-[40vh]">
          <LoadingSpinner size="lg" message="Đang tải giỏ hàng..." />
        </main>
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="min-h-screen bg-background">
        <CartHeader onBack={onBack} />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <CartEmpty />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <CartHeader onBack={onBack} />

      <main className="max-w-4xl mx-auto px-4 py-4">
        {groups.map((group) => (
          <ShopCartGroup
            key={group.sellerId}
            sellerId={group.sellerId}
            sellerName={group.sellerName}
            sellerAvatar={group.sellerAvatar}
            items={group.items}
            selectedIds={selectedIds}
            onToggle={handleToggle}
            onSelectAllInShop={handleSelectAllInShop}
            onQuantityChange={updateQuantity}
            onRemove={handleRemoveItem}
            isUpdating={isBusy}
          />
        ))}
      </main>

      <CartBottomBar
        allSelected={allSelected}
        onSelectAll={handleSelectAll}
        selectedCount={selectedCount}
        selectedSubtotal={selectedSubtotal}
        totalItemCount={itemCount}
        isBusy={isBusy}
        onGoToCheckout={handleGoToCheckout}
        isGoingToCheckout={isGoingToCheckout}
      />
    </div>
  );
}
