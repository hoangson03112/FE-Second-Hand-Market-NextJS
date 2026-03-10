"use client";

import type React from "react";
import { useState, useCallback, useEffect, useRef } from "react";
import { ProductService } from "@/services/product.service";
import type { CreateProductPayload, UpdateProductPayload } from "@/types/productPayload";
import { useToast } from "@/components/ui/Toast";
import { useUser } from "@/hooks/useUser";
import { useRouter, useSearchParams } from "next/navigation";
import type {
  SellFormValues,
  DeliveryOptions,
  IProductWithMediaAndIds,
} from "@/types/sell";
import { sanitizeFieldInput } from "@/utils";
import { PRODUCT_UI_MESSAGES } from "@/constants/messages";

const INITIAL: SellFormValues = {
  name: "",
  price: "",
  stock: "",
  description: "",
  categoryId: "",
  subcategoryId: "",
  condition: "good",
  images: [],
  video: null,
  attributes: [],
};

const INITIAL_DELIVERY: DeliveryOptions = {
  localPickup: true,
  codShipping: false,
};

function mapProductToFormValues(product: IProductWithMediaAndIds): SellFormValues {
  return {
    name: product.name || "",
    price: String(product.price || ""),
    stock: String(product.stock || ""),
    description: product.description || "",
    categoryId:
      product.category?._id ||
      (typeof product.categoryId === "string"
        ? product.categoryId
        : product.categoryId?._id) ||
      "",
    subcategoryId:
      product.subcategory?._id ||
      (typeof product.subcategoryId === "string"
        ? product.subcategoryId
        : product.subcategoryId?._id) ||
      "",
    condition: (product.condition as SellFormValues["condition"]) || "good",
    images: [],
    video: null,
    attributes:
      product.attributes?.map((attr) => ({
        key: attr.key || "",
        value: String(attr.value || ""),
      })) || [],
  };
}

export function useSellForm() {
  const toast = useToast();
  const { data: account } = useUser();
  const searchParams = useSearchParams();
  const editProductId = searchParams.get("edit");
  const isEditMode = !!editProductId;
  const [values, setValues] = useState<SellFormValues>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof SellFormValues, string>>>({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  // Lưu thông tin đầy đủ của ảnh và video hiện tại (khi edit)
  const [existingImages, setExistingImages] = useState<Array<{ url: string; publicId: string; originalName?: string; type?: string; size?: number }>>([]);
  const [existingVideoUrl, setExistingVideoUrl] = useState<string | null>(null);
  // Lưu product data (khi edit) để có thể check status và humanReviewRequested
  const [currentProduct, setCurrentProduct] = useState<IProductWithMediaAndIds | null>(null);
  const router = useRouter();

  // Pickup address selector state
  const [pickupAddressId, setPickupAddressId] = useState("");
  const [pickupAddressError, setPickupAddressError] = useState("");

  // Delivery options state
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOptions>(INITIAL_DELIVERY);
  const [deliveryOptionsError, setDeliveryOptionsError] = useState("");

  // For the "Đăng ký làm Seller" button: show only to buyers
  const showPickupSection = Boolean(account && account.role !== "seller");

  // Reset form when switching from edit to new
  const prevIsEditModeRef = useRef(isEditMode);
  useEffect(() => {
    if (prevIsEditModeRef.current && !isEditMode) {
      setValues(INITIAL);
      setPickupAddressId("");
      setDeliveryOptions(INITIAL_DELIVERY);
      setExistingImages([]);
      setExistingVideoUrl(null);
    }
    prevIsEditModeRef.current = isEditMode;
  }, [isEditMode]);

  // Load product data when in edit mode
  useEffect(() => {
    if (!isEditMode || !editProductId) return;

    let cancelled = false;

    const loadProductForEdit = async () => {
      setIsLoadingProduct(true);
      try {
        const response = await ProductService.getById(editProductId);
        const raw = response as { data?: IProductWithMediaAndIds } | IProductWithMediaAndIds;
        const product = (("data" in raw ? raw.data : raw) ?? null) as IProductWithMediaAndIds | null;

        if (!product || !product._id) {
          toast.error(PRODUCT_UI_MESSAGES.NOT_FOUND);
          router.push("/sell");
          return;
        }

        if (cancelled) return;

        setCurrentProduct(product);

        // Populate form with product data
        let existingImageData = product.images?.map((img) => ({
          url: img.url,
          publicId: img.publicId,
          originalName: img.originalName,
          type: img.type,
          size: img.size,
        })).filter((img) => img.url && img.publicId) || [];

        // Fallback: Nếu images rỗng nhưng có avatar, dùng avatar làm ảnh duy nhất
        if (existingImageData.length === 0 && product.avatar?.url && product.avatar?.publicId) {
          existingImageData = [{
            url: product.avatar.url,
            publicId: product.avatar.publicId,
            originalName: product.avatar.originalName,
            type: product.avatar.type,
            size: product.avatar.size,
          }];
        }

        setExistingImages(existingImageData);
        setExistingVideoUrl(product.video?.url ?? null);
        setValues(mapProductToFormValues(product));

        // Prefill pickup address id from product.address._id
        const addrId = product.address?._id;
        if (addrId) {
          setPickupAddressId(addrId);
        }

        // Prefill delivery options
        if (product.deliveryOptions) {
          setDeliveryOptions({
            localPickup: product.deliveryOptions.localPickup ?? true,
            codShipping: product.deliveryOptions.codShipping ?? false,
          });
        }
      } catch (err) {
        if (cancelled) return;
        console.error("Error loading product:", err);
        toast.error(PRODUCT_UI_MESSAGES.LOAD_ERROR);
        router.push("/sell");
      } finally {
        if (!cancelled) {
          setIsLoadingProduct(false);
        }
      }
    };

    void loadProductForEdit();

    return () => {
      cancelled = true;
    };
  }, [isEditMode, editProductId, toast, router]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      const normalizedValue = sanitizeFieldInput(name, value);
      setValues((prev) => ({
        ...prev,
        [name]: normalizedValue,
        ...(name === "categoryId" ? { subcategoryId: "" } : {}),
      }));
      setApiError("");
      setErrors((prev) => (prev[name as keyof SellFormValues] ? { ...prev, [name]: undefined } : prev));
    },
    []
  );

  const setImages = useCallback((files: File[]) => {
    setValues((prev) => ({ ...prev, images: files }));
    setErrors((prev) => (prev.images ? { ...prev, images: undefined } : prev));
  }, []);

  const setVideo = useCallback((file: File | null) => {
    setValues((prev) => ({ ...prev, video: file }));
  }, []);

  const addAttribute = useCallback(() => {
    setValues((prev) => ({ ...prev, attributes: [...prev.attributes, { key: "", value: "" }] }));
  }, []);

  const removeAttribute = useCallback((index: number) => {
    setValues((prev) => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index),
    }));
  }, []);

  const updateAttribute = useCallback(
    (index: number, field: "key" | "value", value: string) => {
      const normalizedValue = sanitizeFieldInput(field, value);
      setValues((prev) => ({
        ...prev,
        attributes: prev.attributes.map((attr, i) =>
          i === index ? { ...attr, [field]: normalizedValue } : attr
        ),
      }));
    },
    []
  );

  const handleSelectPickupAddress = useCallback((id: string) => {
    setPickupAddressId(id);
    setPickupAddressError("");
  }, []);

  const handleDeliveryOptionsChange = useCallback((opts: DeliveryOptions) => {
    setDeliveryOptions(opts);
    if (opts.localPickup || opts.codShipping) {
      setDeliveryOptionsError("");
    }
  }, []);

  const validate = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof SellFormValues, string>> = {};
    if (!values.name.trim()) newErrors.name = "Vui lòng nhập tên sản phẩm";
    if (!values.price.trim()) newErrors.price = "Vui lòng nhập giá";
    else if (Number(values.price) <= 0 || Number.isNaN(Number(values.price)))
      newErrors.price = "Giá không hợp lệ";
    if (!values.stock.trim()) newErrors.stock = "Vui lòng nhập số lượng";
    else if (Number(values.stock) < 0 || !Number.isInteger(Number(values.stock)))
      newErrors.stock = "Số lượng phải là số nguyên không âm";
    if (!values.categoryId) newErrors.categoryId = "Vui lòng chọn danh mục";
    if (!values.subcategoryId) newErrors.subcategoryId = "Vui lòng chọn danh mục con";
    if (values.images.length === 0 && existingImages.length === 0) {
      newErrors.images = "Vui lòng tải ít nhất 1 ảnh sản phẩm";
    }
    setErrors(newErrors);

    let valid = Object.keys(newErrors).length === 0;

    if (!pickupAddressId) {
      setPickupAddressError("Vui lòng chọn địa chỉ lấy hàng");
      valid = false;
    } else {
      setPickupAddressError("");
    }

    if (!deliveryOptions.localPickup && !deliveryOptions.codShipping) {
      setDeliveryOptionsError("Vui lòng chọn ít nhất một hình thức giao hàng");
      valid = false;
    } else {
      setDeliveryOptionsError("");
    }

    return valid;
  }, [values, existingImages, pickupAddressId, deliveryOptions]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setApiError("");
      if (!validate()) return;

      setIsLoading(true);
      try {
        const attributesFiltered = values.attributes.filter(
          (a) => a.key.trim() && a.value.trim()
        );
        const payload: CreateProductPayload | UpdateProductPayload = {
          name: values.name.trim(),
          price: Number(values.price),
          stock: Number(values.stock),
          description: values.description.trim() || undefined,
          categoryId: values.categoryId,
          subcategoryId: values.subcategoryId,
          condition: values.condition,
          attributes: attributesFiltered.map((a) => ({ key: a.key.trim(), value: a.value.trim() })),
          images: values.images,
          video: values.video ?? undefined,
          addressId: pickupAddressId,
          deliveryOptions,
        };

        if (isEditMode && editProductId) {
          const updatePayload: UpdateProductPayload = {
            ...payload,
            existingImages: existingImages,
          };
          const result = await ProductService.update(editProductId, updatePayload);
          if (result.success) {
            const shouldAutoRequestReview =
              currentProduct?.status === "rejected" &&
              !currentProduct?.aiModerationResult?.humanReviewRequested;

            if (shouldAutoRequestReview) {
              try {
                await ProductService.requestReview(editProductId);
                toast.success(PRODUCT_UI_MESSAGES.UPDATE_AND_REVIEW_SUCCESS);
              } catch {
                toast.success(PRODUCT_UI_MESSAGES.UPDATE_SUCCESS);
                toast.error(PRODUCT_UI_MESSAGES.UPDATE_REVIEW_REQUEST_ERROR);
              }
            } else {
              toast.success(PRODUCT_UI_MESSAGES.UPDATE_SUCCESS);
            }

            setValues(INITIAL);
            setIsLoading(false);
            setTimeout(() => {
              router.push("/my/listings");
            }, 100);
          } else {
            setApiError("Cập nhật sản phẩm thất bại. Vui lòng thử lại.");
            setIsLoading(false);
          }
        } else {
          const result = await ProductService.create(payload);
          if (result.success) {
            toast.success(PRODUCT_UI_MESSAGES.PUBLISH_SUCCESS);
            setValues(INITIAL);
            setIsLoading(false);
            setTimeout(() => {
              router.push("/my/listings");
            }, 100);
          } else {
            setApiError("Đăng sản phẩm thất bại. Vui lòng thử lại.");
            setIsLoading(false);
          }
        }
      } catch (err: unknown) {
        const ax = err as { response?: { data?: { message?: string } } };
        setApiError(
          (ax.response?.data as { message?: string })?.message ?? "Có lỗi xảy ra. Vui lòng thử lại."
        );
        setIsLoading(false);
      }
    },
    [
      values,
      validate,
      toast,
      router,
      pickupAddressId,
      deliveryOptions,
      isEditMode,
      editProductId,
      currentProduct,
      existingImages,
    ]
  );

  const removeExistingImage = useCallback((index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const removeExistingVideo = useCallback(() => {
    setExistingVideoUrl(null);
  }, []);

  return {
    values,
    setValues,
    errors,
    apiError,
    isLoading,
    isLoadingProduct,
    isEditMode,
    existingImageUrls: existingImages.map((img) => img.url),
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
    // Pickup address selector
    pickupAddressId,
    pickupAddressError,
    handleSelectPickupAddress,
    // Delivery options
    deliveryOptions,
    deliveryOptionsError,
    handleDeliveryOptionsChange,
    // For "Become Seller" button visibility
    showPickupSection,
  };
}
