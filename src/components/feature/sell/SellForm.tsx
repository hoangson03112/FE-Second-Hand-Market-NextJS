"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  Package,
  FolderTree,
  FileText,
  ImageIcon,
  ListPlus,
  Plus,
  Trash2,
  Upload,
  Video,
  Film,
  AlertCircle,
} from "lucide-react";
import { useSellForm } from "./hooks";
import { useCategories } from "@/hooks/useCategories";
import { ErrorMessage } from "@/components/feature/auth";
import { PickupAddressSection } from "./components";
import { useRouter } from "next/navigation";

const CONDITION_OPTIONS: {
  value: "new" | "like_new" | "good" | "fair" | "poor";
  label: string;
}[] = [
  { value: "new", label: "Mới" },
  { value: "like_new", label: "Như mới" },
  { value: "good", label: "Tốt" },
  { value: "fair", label: "Khá" },
  { value: "poor", label: "Đã dùng lâu" },
];

function SectionCard({
  icon: Icon,
  title,
  children,
  className = "",
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col ${className}`}
    >
      <div className="flex items-center gap-2 px-3 py-2.5 bg-muted/50 border-b border-border shrink-0">
        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-primary" />
        </div>
        <h3 className="text-xs font-semibold text-foreground">{title}</h3>
      </div>
      <div className="p-3 space-y-3 flex-1 min-h-0">{children}</div>
    </div>
  );
}

export default function SellForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
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
    pickup,
    pickupErrors,
    savedPickup,
    provinces,
    districts,
    wards,
    onPickupProvinceChange,
    onPickupDistrictChange,
    onPickupWardChange,
    onPickupBusinessAddressChange,
    onPickupPhoneNumberChange,
  } = useSellForm();

  // Check if can request review
  const canRequestReview =
    isEditMode &&
    currentProduct?.status === "rejected" &&
    !currentProduct?.aiModerationResult?.humanReviewRequested;

  const subCategories = values.categoryId
    ? categories.find((c) => c._id === values.categoryId)?.subCategories ?? []
    : [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const images = files.filter((f) => f.type.startsWith("image/")).slice(0, 10);
    setImages(images);
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages(values.images.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files ? Array.from(e.dataTransfer.files) : [];
    const images = files.filter((f) => f.type.startsWith("image/")).slice(0, 10);
    if (images.length) setImages([...values.images, ...images].slice(0, 10));
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("video/")) setVideo(file);
    e.target.value = "";
  };

  const removeVideo = () => setVideo(null);

  const inputClass =
    "w-full rounded-lg border border-border bg-background px-2.5 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0";
  const labelClass = "block text-xs font-medium text-foreground mb-1";

  if (isLoadingProduct) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-6 lg:py-8">
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
    <div className="w-full max-w-6xl mx-auto px-4 py-6 lg:py-8">
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
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <ErrorMessage message={apiError} />

        {/* Địa chỉ lấy hàng: full-width, chỉ hiện với tài khoản buyer (chưa seller) */}
        {showPickupSection && (
          <PickupAddressSection
            values={pickup}
            errors={pickupErrors}
            provinces={provinces}
            districts={districts}
            wards={wards}
            savedPickup={savedPickup}
            onProvinceChange={onPickupProvinceChange}
            onDistrictChange={onPickupDistrictChange}
            onWardChange={onPickupWardChange}
            onBusinessAddressChange={onPickupBusinessAddressChange}
            onPhoneNumberChange={onPickupPhoneNumberChange}
          />
        )}

        <div className="grid lg:grid-cols-2 gap-4 lg:gap-6 lg:items-stretch">
          {/* Cột trái: thông tin + danh mục + mô tả */}
          <div className="flex flex-col gap-4">
            <SectionCard icon={Package} title="Thông tin cơ bản">
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>
                    Tên sản phẩm <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    placeholder="VD: Áo thun nam cotton"
                    className={inputClass}
                  />
                  {errors.name && (
                    <p className="mt-0.5 text-xs text-red-500">{errors.name}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={labelClass}>
                      Giá (VNĐ) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={values.price}
                      onChange={handleChange}
                      min={0}
                      placeholder="0"
                      className={inputClass}
                    />
                    {errors.price && (
                      <p className="mt-0.5 text-xs text-red-500">{errors.price}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>
                      Số lượng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={values.stock}
                      onChange={handleChange}
                      min={0}
                      step={1}
                      placeholder="1"
                      className={inputClass}
                    />
                    {errors.stock && (
                      <p className="mt-0.5 text-xs text-red-500">{errors.stock}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Tình trạng</label>
                  <select
                    name="condition"
                    value={values.condition}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    {CONDITION_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </SectionCard>

            <SectionCard icon={FolderTree} title="Danh mục">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={labelClass}>
                    Danh mục <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="categoryId"
                    value={values.categoryId}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Chọn</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="mt-0.5 text-xs text-red-500">{errors.categoryId}</p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>
                    Danh mục con <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="subcategoryId"
                    value={values.subcategoryId}
                    onChange={handleChange}
                    disabled={!values.categoryId}
                    className={inputClass}
                  >
                    <option value="">Chọn</option>
                    {subCategories.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  {errors.subcategoryId && (
                    <p className="mt-0.5 text-xs text-red-500">{errors.subcategoryId}</p>
                  )}
                </div>
              </div>
            </SectionCard>

            <SectionCard icon={FileText} title="Mô tả" className="flex-1 min-h-0">
              <textarea
                name="description"
                value={values.description}
                onChange={handleChange}
                rows={5}
                placeholder="Mô tả chi tiết: xuất xứ, chất liệu, tình trạng..."
                className={`${inputClass} resize-none w-full`}
              />
            </SectionCard>
          </div>

          {/* Cột phải: Thuộc tính + Ảnh & Video — chia đều với cột trái */}
          <div className="flex flex-col gap-4">
            <SectionCard icon={ListPlus} title="Thuộc tính" className="min-h-0 shrink-0">
              <div className="space-y-2">
                <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                  {values.attributes.map((attr, index) => (
                    <div
                      key={index}
                      className="flex gap-1.5 items-center rounded-md border border-border bg-muted/30 p-1.5"
                    >
                      <input
                        type="text"
                        value={attr.key}
                        onChange={(e) => updateAttribute(index, "key", e.target.value)}
                        placeholder="Tên"
                        className="flex-1 min-w-0 rounded border border-border bg-background px-2 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      />
                      <input
                        type="text"
                        value={attr.value}
                        onChange={(e) => updateAttribute(index, "value", e.target.value)}
                        placeholder="Giá trị"
                        className="flex-1 min-w-0 rounded border border-border bg-background px-2 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      />
                      <button
                        type="button"
                        onClick={() => removeAttribute(index)}
                        className="p-1.5 rounded text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Xóa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addAttribute}
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-2 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Thêm thuộc tính
                </button>
              </div>
            </SectionCard>

            <SectionCard icon={ImageIcon} title="Ảnh & Video" className="flex-1 min-h-0 flex flex-col">
              <div className="space-y-4 flex-1 min-h-0 flex flex-col">
                {/* Ảnh: ít nhất 1, tối đa 10 */}
                <div className="flex-shrink-0">
                  <p className="text-xs font-medium text-foreground mb-2">
                    Ảnh sản phẩm <span className="text-red-500">*</span> (ít nhất 1, tối đa 10)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-lg border-2 border-dashed border-border bg-muted/30 px-4 py-4 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    <Upload className="w-7 h-7 mx-auto text-muted-foreground mb-1" />
                    <p className="text-xs font-medium text-foreground">
                      Chọn ảnh hoặc kéo thả
                    </p>
                  </div>
                  {/* Hiển thị ảnh cũ (khi edit) */}
                  {existingImageUrls.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {existingImageUrls.map((url, i) => (
                        <div
                          key={`existing-${i}`}
                          className="relative aspect-square rounded-lg border border-border overflow-hidden bg-muted group"
                        >
                          <img
                            src={url}
                            alt={`Ảnh sản phẩm ${i + 1}${i === 0 ? ' (ảnh đại diện)' : ''}`}
                            className="w-full h-full object-cover"
                          />
                          {i === 0 && values.images.length === 0 && (
                            <span className="absolute bottom-0.5 left-0.5 text-[9px] font-medium bg-primary text-primary-foreground px-1 py-0.5 rounded">
                              Đại diện
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeExistingImage(i);
                            }}
                            className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                            aria-label="Xóa ảnh"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Hiển thị ảnh mới */}
                  {values.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {values.images.map((file, i) => (
                        <div
                          key={`new-${i}`}
                          className="relative aspect-square rounded-lg border border-border overflow-hidden bg-muted group"
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Ảnh sản phẩm mới ${i + 1}${i === 0 && existingImageUrls.length === 0 ? ' (ảnh đại diện)' : ''}`}
                            className="w-full h-full object-cover"
                          />
                          {(i === 0 && existingImageUrls.length === 0) && (
                            <span className="absolute bottom-0.5 left-0.5 text-[9px] font-medium bg-primary text-primary-foreground px-1 py-0.5 rounded">
                              Đại diện
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(i);
                            }}
                            className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                            aria-label="Xóa ảnh"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {errors.images && (
                    <p className="mt-1 text-xs text-red-500">{errors.images}</p>
                  )}
                </div>

                {/* Video: tùy chọn, tối đa 1 */}
                <div className="pt-2 border-t border-border flex-shrink-0">
                  <p className="text-xs font-medium text-foreground mb-2 flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5" />
                    Video (tùy chọn, tối đa 50MB)
                  </p>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="hidden"
                  />
                  {/* Hiển thị video cũ (khi edit) */}
                  {existingVideoUrl && !values.video && (
                    <div className="relative rounded-lg border border-border bg-muted/30 p-2 flex items-center gap-2 mb-2">
                      <div className="w-10 h-10 rounded bg-muted flex items-center justify-center shrink-0">
                        <Video className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-foreground truncate">
                          Video hiện tại
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Đã tải lên
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={removeExistingVideo}
                        className="p-1.5 rounded text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Xóa video"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {/* Hiển thị video mới hoặc nút chọn video */}
                  {!values.video && !existingVideoUrl ? (
                    <button
                      type="button"
                      onClick={() => videoInputRef.current?.click()}
                      className="w-full rounded-lg border-2 border-dashed border-border bg-muted/30 px-4 py-4 text-center hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center gap-1"
                    >
                      <Video className="w-7 h-7 text-muted-foreground" />
                      <span className="text-xs font-medium text-foreground">
                        Chọn video
                      </span>
                    </button>
                  ) : values.video ? (
                    <div className="relative rounded-lg border border-border bg-muted/30 p-2 flex items-center gap-2">
                      <div className="w-10 h-10 rounded bg-muted flex items-center justify-center shrink-0">
                        <Video className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-foreground truncate">
                          {values.video.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {(values.video.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={removeVideo}
                        className="p-1.5 rounded text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Xóa video"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : null}
                  {/* Nút thêm video mới khi đã có video cũ */}
                  {existingVideoUrl && !values.video && (
                    <button
                      type="button"
                      onClick={() => videoInputRef.current?.click()}
                      className="w-full mt-2 rounded-lg border-2 border-dashed border-border bg-muted/30 px-4 py-2 text-center hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center gap-1"
                    >
                      <Video className="w-5 h-5 text-muted-foreground" />
                      <span className="text-xs font-medium text-foreground">
                        Thay thế video
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </SectionCard>
          </div>
        </div>

        {/* Rejected product warning & request review */}
        {currentProduct?.status === "rejected" && (
          <div className="rounded-xl border border-red-200 bg-red-50/50 dark:bg-red-900/10 p-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-red-900 dark:text-red-300 mb-1">
                  Sản phẩm bị từ chối
                </h4>
                {currentProduct?.aiModerationResult?.rejectionReason && (
                  <p className="text-xs text-red-700 dark:text-red-400 mb-3">
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
            className="flex-1 rounded-full bg-primary text-white font-medium py-2.5 px-6 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
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
            className="flex-1 text-center rounded-full border border-border py-2.5 px-6 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            Hủy
          </Link>
        </div>
      </form>
    </div>
  );
}
