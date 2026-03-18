"use client";

import { IconPackage, IconFolders, IconFileText, IconPhoto, IconListDetails } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useSellForm } from "./hooks";
import { usePickupAddresses } from "./hooks";
import { useCategories } from "@/hooks/useCategories";
import { useUser } from "@/hooks/useUser";
import { SellerService } from "@/services/seller.service";
import ErrorMessage from "@/features/auth/ErrorMessage";
import {
  DeliveryOptions,
  PickupAddressSelector,
  ProductAttributes,
  ProductBasicInfo,
  ProductCategory,
  ProductDescription,
  ProductMedia,
  SectionCard,
  SellFormHeader,
  SellerLimitInfoBox,
  RejectedProductBanner,
  SellFormActions,
} from "./components";
import { AddressFormModal } from "./components/AddressFormModal";

export default function SellForm() {
  const { data: categories = [] } = useCategories();
  const {
    values,
    errors,
    apiError,
    isLoading,
    isLoadingProduct,
    isEditMode,
    existingImageUrls,
    existingVideoUrl,
    currentProduct,
    handleChange,
    setImages,
    setVideo,
    removeExistingImage,
    removeExistingVideo,
    handleSubmit,
    addAttribute,
    removeAttribute,
    updateAttribute,
    showPickupSection,
    pickupAddressId,
    pickupAddressError,
    handleSelectPickupAddress,
    deliveryOptions,
    deliveryOptionsError,
    handleDeliveryOptionsChange,
  } = useSellForm();

  const {
    addresses: pickupAddresses,
    isLoading: pickupAddressesLoading,
    editingAddress,
    showModal,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseModal,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = usePickupAddresses();

  const { data: account } = useUser();
  const { data: productLimit } = useQuery({
    queryKey: ["seller", "product-limit"],
    queryFn: () => SellerService.getProductLimit(),
    staleTime: 60_000,
  });

  const isSeller = account?.role === "seller";

  // Check if can request review
  const canRequestReview =
    isEditMode &&
    currentProduct?.status === "rejected" &&
    !currentProduct?.aiModerationResult?.humanReviewRequested;

  if (isLoadingProduct) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-6 lg:py-8">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">
              Đang tải thông tin sản phẩm...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-7xl mx-auto px-4 py-6 lg:py-8">
        <SellFormHeader
          isEditMode={isEditMode}
          showBecomeSellerLink={showPickupSection && !isEditMode}
        />

        {!isEditMode && (
          <SellerLimitInfoBox isSeller={isSeller} productLimit={productLimit ?? null} />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <ErrorMessage message={apiError} />

          {/* Địa chỉ lấy hàng – hiển thị cho tất cả users */}
          <PickupAddressSelector
            addresses={pickupAddresses}
            selectedId={pickupAddressId}
            onSelect={handleSelectPickupAddress}
            onAdd={handleOpenAdd}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
            isLoading={pickupAddressesLoading}
            error={pickupAddressError}
          />

          {/* Hình thức giao hàng */}
          <DeliveryOptions
            value={deliveryOptions}
            onChange={handleDeliveryOptionsChange}
            error={deliveryOptionsError}
          />

          <div className="grid lg:grid-cols-2 gap-4 lg:gap-6 lg:items-stretch">
            {/* Cột trái: thông tin + danh mục + mô tả */}
            <div className="flex flex-col gap-4">
              <SectionCard icon={IconPackage} title="Thông tin cơ bản">
                <ProductBasicInfo
                  values={{
                    name: values.name,
                    price: values.price,
                    stock: values.stock,
                    condition: values.condition,
                  }}
                  errors={{
                    name: errors.name,
                    price: errors.price,
                    stock: errors.stock,
                  }}
                  onChange={handleChange}
                />
              </SectionCard>

              <SectionCard icon={IconFolders} title="Danh mục">
                <ProductCategory
                  categoryId={values.categoryId}
                  subcategoryId={values.subcategoryId}
                  errors={{
                    categoryId: errors.categoryId,
                    subcategoryId: errors.subcategoryId,
                  }}
                  categories={categories}
                  onChange={handleChange}
                />
              </SectionCard>

              <SectionCard
                icon={IconFileText}
                title="Mô tả"
                className="flex-1 min-h-0"
              >
                <ProductDescription
                  value={values.description}
                  onChange={handleChange}
                />
              </SectionCard>
            </div>

            {/* Cột phải: Thuộc tính + Ảnh & IconVideo — chia đều với cột trái */}
            <div className="flex flex-col gap-4">
              <SectionCard
                icon={IconListDetails}
                title="Thuộc tính"
                className="min-h-0 shrink-0"
              >
                <ProductAttributes
                  attributes={values.attributes}
                  onAdd={addAttribute}
                  onRemove={removeAttribute}
                  onUpdate={updateAttribute}
                />
              </SectionCard>

              <SectionCard
                icon={IconPhoto}
                title="Ảnh & Video"
                className="flex-1 min-h-0 flex flex-col"
              >
                <ProductMedia
                  existingImages={existingImageUrls}
                  newImages={values.images}
                  imageError={errors.images}
                  onImagesChange={setImages}
                  onRemoveExistingImage={removeExistingImage}
                  existingVideoUrl={existingVideoUrl}
                  newVideo={values.video}
                  onVideoChange={setVideo}
                  onRemoveExistingVideo={removeExistingVideo}
                />
              </SectionCard>
            </div>
          </div>

          {currentProduct?.status === "rejected" && (
            <RejectedProductBanner
              rejectionReason={currentProduct.aiModerationResult?.rejectionReason}
              humanReviewRequested={currentProduct.aiModerationResult?.humanReviewRequested}
            />
          )}

          <SellFormActions
            isEditMode={isEditMode}
            isLoading={isLoading}
            canRequestReview={canRequestReview}
          />
        </form>
      </div>

      {/* Modal thêm/sửa địa chỉ lấy hàng */}
      <AddressFormModal
        isOpen={showModal}
        editingAddress={editingAddress}
        onClose={handleCloseModal}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />
    </>
  );
}
