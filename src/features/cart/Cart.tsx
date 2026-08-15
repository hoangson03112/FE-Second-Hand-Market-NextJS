"use client";

import { useRouter } from "next/navigation";
import CartHeader from "./components/CartHeader";
import ShopCartGroup from "./components/ShopCartGroup";
import CartBottomBar from "./components/CartBottomBar";
import CartEmpty from "./components/CartEmpty";
import CartLoginPrompt from "./components/CartLoginPrompt";
import { LoadingBlock } from "@/components/ui";
import { useCartPage } from "./hooks/useCartPage";
import { useUser } from "@/features/auth/hooks/useUser";
import { PageContainer, Container } from "@/components/layout/Container";

export default function Cart() {
  const router = useRouter();
  const { data: account, isLoading: isUserLoading } = useUser();
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

  const handleBack = () => router.back();

  if (!isUserLoading && !account) {
    return (
      <PageContainer withBackground={false} className="bg-luxury-ivory min-h-screen">
        <CartHeader onBack={handleBack} />
        <Container as="main" maxWidth="9xl" paddingX="md" paddingY="md">
          <CartLoginPrompt />
        </Container>
      </PageContainer>
    );
  }

  if (isUserLoading || isLoadingCart) {
    return (
      <PageContainer withBackground={false} className="bg-luxury-ivory min-h-screen">
        <CartHeader onBack={handleBack} />
        <Container as="main" maxWidth="9xl" paddingX="md" paddingY="lg" className="flex items-center justify-center min-h-[40vh]">
          <LoadingBlock
            text="Đang tải giỏ hàng..."
            spinnerSize="lg"
            className="w-full max-w-md"
          />
        </Container>
      </PageContainer>
    );
  }

  if (!cartItems.length) {
    return (
      <PageContainer withBackground={false} className="bg-luxury-ivory min-h-screen">
        <CartHeader onBack={handleBack} />
        <Container as="main" maxWidth="9xl" paddingX="md" paddingY="lg">
          <CartEmpty />
        </Container>
      </PageContainer>
    );
  }

  return (
    <PageContainer withBackground={false} className="pb-24 bg-luxury-ivory min-h-screen">
      <CartHeader onBack={handleBack} />
      <Container as="main" maxWidth="9xl" paddingX="md" paddingY="md">
        {groups.map((group) => (
          <ShopCartGroup
            key={group.sellerId}
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
