"use client";

import {
  IconPackage,
  IconFolders,
  IconFileText,
  IconPhoto,
  IconListDetails,
  IconAlertCircle,
  IconBuildingStore,
  IconArrowRight,
} from "@tabler/icons-react";
import Link from "next/link";
import { useSellForm } from "./hooks";
import { usePickupAddresses } from "./hooks";
import { useCategories } from "@/hooks/useCategories";
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
            <p className="text-sm text-muted-foreground">Đang tải thông tin sản phẩm...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="w-full max-w-7xl mx-auto px-4 py-6 lg:py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight">
            {isEditMode ? "Cập nhật sản phẩm" : "Đăng sản phẩm"}
          </h1>
          <p className="text-muted-foreground text-xs mt-0.5">
            {isEditMode
              ? "Cập nhật thông tin sản phẩm của bạn"
              : "Điền thông tin để sản phẩm dễ được tìm thấy"}
          </p>
        </div>
        {showPickupSection && !isEditMode && (
          <Link
            href="/become-seller"
            className="flex items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/5 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/10 hover:border-primary transition-colors shrink-0"
          >
            <IconBuildingStore className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Đăng ký làm Seller</span>
            <span className="sm:hidden">Làm Seller</span>
            <IconArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>

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

            <SectionCard icon={IconFileText} title="Mô tả" className="flex-1 min-h-0">
              <ProductDescription value={values.description} onChange={handleChange} />
            </SectionCard>
          </div>

          {/* Cột phải: Thuộc tính + Ảnh & IconVideo — chia đều với cột trái */}
          <div className="flex flex-col gap-4">
            <SectionCard icon={IconListDetails} title="Thuộc tính" className="min-h-0 shrink-0">
              <ProductAttributes
                attributes={values.attributes}
                onAdd={addAttribute}
                onRemove={removeAttribute}
                onUpdate={updateAttribute}
              />
            </SectionCard>

            <SectionCard icon={IconPhoto} title="Ảnh & Video" className="flex-1 min-h-0 flex flex-col">
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

        {/* Rejected product warning & request review */}
        {currentProduct?.status === "rejected" && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/8 dark:bg-destructive/15 p-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-10 h-10 rounded-full bg-destructive/10 dark:bg-destructive/20 flex items-center justify-center">
                <IconAlertCircle className="w-5 h-5 text-destructive" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-destructive mb-1">
                  Sản phẩm bị từ chối
                </h4>
                {currentProduct?.aiModerationResult?.rejectionReason && (
                  <p className="text-xs text-destructive/80 mb-3">
                    <span className="font-medium">Lý do:</span>{" "}
                    {currentProduct.aiModerationResult.rejectionReason}
                  </p>
                )}
                {currentProduct?.aiModerationResult?.humanReviewRequested ? (
                  <div className="flex items-center gap-2 text-xs text-blue-700 dark:text-blue-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    Đã yêu cầu duyệt lại. Admin sẽ xem xét trong 24h.
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Bạn có thể chỉnh sửa sản phẩm theo yêu cầu, sau đó nhấn &ldquo;Lưu và yêu cầu duyệt lại&rdquo; để admin xem xét.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {isLoading
              ? isEditMode
                ? canRequestReview
                  ? "Đang lưu và yêu cầu duyệt lại..."
                  : "Đang cập nhật..."
                : "Đang đăng..."
              : isEditMode
                ? canRequestReview
                  ? "Lưu và yêu cầu duyệt lại"
                  : "Cập nhật sản phẩm"
                : "Đăng sản phẩm"}
          </button>
          <Link
            href={isEditMode ? "/my/listings" : "/"}
            className="flex-1 text-center h-11 rounded-xl flex items-center justify-center border border-border text-muted-foreground text-sm font-medium hover:bg-muted hover:text-foreground transition-colors"
          >
            Hủy
          </Link>
        </div>
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
