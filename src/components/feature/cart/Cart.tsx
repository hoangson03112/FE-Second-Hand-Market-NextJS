"use client";

import { useRouter } from "next/navigation";
import CartHeader from "./components/CartHeader";
import ShopCartGroup from "./components/ShopCartGroup";
import CartBottomBar from "./components/CartBottomBar";
import CartEmpty from "./components/CartEmpty";
import CartLoginPrompt from "./components/CartLoginPrompt";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useCartPage } from "./hooks";
import { useTokenStore } from "@/store/useTokenStore";
import { PageContainer, Container } from "@/components/layout/Container";

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
      <PageContainer withBackground={false}>
        <CartHeader onBack={onBack} />
        <Container as="main" maxWidth="4xl" paddingX="md" paddingY="md">
          <CartLoginPrompt />
        </Container>
      </PageContainer>
    );
  }

  if (isLoadingCart) {
    return (
      <PageContainer withBackground={false}>
        <CartHeader onBack={onBack} />
        <Container as="main" maxWidth="4xl" paddingX="md" paddingY="lg" className="flex items-center justify-center min-h-[40vh]">
          <LoadingSpinner size="lg" message="Đang tải giỏ hàng..." />
        </Container>
      </PageContainer>
    );
  }

  if (!cartItems.length) {
    return (
      <PageContainer withBackground={false}>
        <CartHeader onBack={onBack} />
        <Container as="main" maxWidth="4xl" paddingX="md" paddingY="lg">
          <CartEmpty />
        </Container>
      </PageContainer>
    );
  }

  return (
    <PageContainer withBackground={false} className="pb-24">
      <CartHeader onBack={onBack} />
      <Container as="main" maxWidth="4xl" paddingX="md" paddingY="md">
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
      </Container>
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
    </PageContainer>
  );
}
