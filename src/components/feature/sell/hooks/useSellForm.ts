"use client";

import type React from "react";
import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { ProductService } from "@/services/product.service";
import type { CreateProductPayload, UpdateProductPayload } from "@/types/productPayload";
import { useToast } from "@/components/ui";
import { useUser } from "@/hooks/useUser";
import { useProvinces, useDistricts, useWards } from "@/hooks/useGHNLocation";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient, type QueryClient } from "@tanstack/react-query";
import { AddressService } from "@/services/address.service";
import type {
  SellFormValues,
  PickupFormValues,
  IProductWithMediaAndIds,
} from "@/types/sell";
import type { Address } from "@/types/address";

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

const PICKUP_INITIAL: PickupFormValues = {
  provinceId: "",
  districtId: "",
  wardCode: "",
  businessAddress: "",
  phoneNumber: "",
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

type SellerPickupRaw = {
  from_district_id?: string;
  from_ward_code?: string;
  businessAddress?: string;
  from_province_id?: string;
};

const INVALID_ADDRESS_PLACEHOLDER = "Không xác định";

function getSellerPickupFromProduct(
  product: IProductWithMediaAndIds
): {
  provinceId?: string;
  districtId: string;
  wardCode: string;
  businessAddress: string;
  phoneNumber?: string;
} | null {
  // Ưu tiên product.pickupAddress (địa chỉ lưu theo từng sp – buyer 3 sp = 3 địa chỉ khác nhau)
  const pickup = product.pickupAddress;
  if (pickup?.districtId && pickup?.wardCode && pickup?.businessAddress) {
    if (
      pickup.districtId !== INVALID_ADDRESS_PLACEHOLDER &&
      pickup.wardCode !== INVALID_ADDRESS_PLACEHOLDER &&
      pickup.businessAddress !== INVALID_ADDRESS_PLACEHOLDER
    ) {
      return {
        provinceId: pickup.provinceId ?? undefined,
        districtId: pickup.districtId,
        wardCode: pickup.wardCode,
        businessAddress: pickup.businessAddress,
        phoneNumber: pickup.phoneNumber ?? undefined,
      };
    }
  }

  // Fallback: product.seller (verified seller hoặc backend merge từ pickupAddress)
  const seller = product.seller as SellerPickupRaw | undefined;
  if (!seller) return null;

  const sellerDistrictId = seller.from_district_id;
  const sellerWardCode = seller.from_ward_code;
  const sellerBusinessAddress = seller.businessAddress;

  if (
    !sellerDistrictId ||
    !sellerWardCode ||
    !sellerBusinessAddress ||
    sellerDistrictId === INVALID_ADDRESS_PLACEHOLDER ||
    sellerWardCode === INVALID_ADDRESS_PLACEHOLDER ||
    sellerBusinessAddress === INVALID_ADDRESS_PLACEHOLDER
  ) {
    return null;
  }

  return {
    provinceId: seller.from_province_id
      ? String(seller.from_province_id)
      : undefined,
    districtId: String(sellerDistrictId),
    wardCode: sellerWardCode,
    businessAddress: sellerBusinessAddress,
    phoneNumber: undefined,
  };
}

async function resolveProvinceIdFromDistrict(
  districtId: string,
  queryClient: QueryClient
): Promise<string | null> {
  const allProvinces = await queryClient.ensureQueryData({
    queryKey: ["ghn", "provinces"],
    queryFn: () => AddressService.getProvinces(),
    staleTime: Infinity,
  });

  if (!allProvinces?.length) return null;

  for (const province of allProvinces) {
    const cached = queryClient.getQueryData<
      Awaited<ReturnType<typeof AddressService.getDistricts>>
    >(["ghn", "districts", province.ProvinceID]);
    if (!cached) continue;
    const found = cached.find(
      (d) => String(d.DistrictID) === String(districtId)
    );
    if (found) {
      return String(province.ProvinceID);
    }
  }

  return null;
}

function validatePickupFields(
  pickup: PickupFormValues
): Partial<Record<keyof PickupFormValues, string>> {
  const pickupErr: Partial<Record<keyof PickupFormValues, string>> = {};

  if (!pickup.provinceId) {
    pickupErr.provinceId = "Vui lòng chọn Tỉnh/Thành phố";
  }
  if (!pickup.districtId) {
    pickupErr.districtId = "Vui lòng chọn Quận/Huyện";
  }
  if (!pickup.wardCode) {
    pickupErr.wardCode = "Vui lòng chọn Phường/Xã";
  }
  if (!pickup.businessAddress?.trim()) {
    pickupErr.businessAddress = "Vui lòng nhập địa chỉ cụ thể";
  }
  if (!pickup.phoneNumber?.trim()) {
    pickupErr.phoneNumber = "Vui lòng nhập số điện thoại";
  } else if (!/^[0-9]{10,11}$/.test(pickup.phoneNumber.replace(/\s/g, ""))) {
    pickupErr.phoneNumber = "Số điện thoại không hợp lệ (10-11 số)";
  }

  return pickupErr;
}

export function useSellForm() {
  const toast = useToast();
  const { data: account } = useUser();
  const searchParams = useSearchParams();
  const editProductId = searchParams.get("edit");
  const isEditMode = !!editProductId;
  const queryClient = useQueryClient();
  const [values, setValues] = useState<SellFormValues>(INITIAL);
  const [pickup, setPickup] = useState<PickupFormValues>(PICKUP_INITIAL);
  const [savedPickup, setSavedPickup] = useState<Address | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof SellFormValues, string>>>({});
  const [pickupErrors, setPickupErrors] = useState<Partial<Record<keyof PickupFormValues, string>>>({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  // Lưu URLs của ảnh và video hiện tại (khi edit)
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [existingVideoUrl, setExistingVideoUrl] = useState<string | null>(null);
  // Lưu product data (khi edit) để có thể check status và humanReviewRequested
  const [currentProduct, setCurrentProduct] = useState<IProductWithMediaAndIds | null>(null);
  const router = useRouter();

  const showPickupSection = Boolean(account && account.role !== "seller");

  const { data: provinces = [] } = useProvinces();
  const { data: districts = [] } = useDistricts(
    pickup.provinceId ? Number(pickup.provinceId) : undefined
  );
  const { data: wards = [] } = useWards(
    pickup.districtId ? Number(pickup.districtId) : undefined
  );

  const selectedProvince = useMemo(
    () => provinces.find((p) => String(p.ProvinceID) === pickup.provinceId) ?? null,
    [provinces, pickup.provinceId]
  );
  const selectedDistrict = useMemo(
    () => districts.find((d) => String(d.DistrictID) === pickup.districtId) ?? null,
    [districts, pickup.districtId]
  );
  const selectedWard = useMemo(
    () => wards.find((w) => w.WardCode === pickup.wardCode) ?? null,
    [wards, pickup.wardCode]
  );

  // Reset form (bao gồm pickup) khi chuyển từ edit sang tạo mới (không reset khi mount lần đầu)
  const prevIsEditModeRef = useRef(isEditMode);
  useEffect(() => {
    if (prevIsEditModeRef.current && !isEditMode) {
      setValues(INITIAL);
      setPickup(PICKUP_INITIAL);
      setExistingImageUrls([]);
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
          toast.error("Không tìm thấy sản phẩm");
          router.push("/sell");
          return;
        }

        if (cancelled) return;

        // Lưu product data để check status và humanReviewRequested
        setCurrentProduct(product);
        
        // Populate form with product data
        const imageUrls = product.images?.map((img) => img.url).filter(Boolean) || [];
        const videoUrl = product.video?.url ?? null;

        setExistingImageUrls(imageUrls);
        setExistingVideoUrl(videoUrl);
        setValues(mapProductToFormValues(product));

        // Prefill pickup: ưu tiên từ product.seller, nếu không có (buyer/sản phẩm từ chối) thì fallback sang địa chỉ đã lưu
        if (showPickupSection) {
          const sellerPickup = getSellerPickupFromProduct(product);
          if (sellerPickup) {
            const { provinceId, districtId, wardCode, businessAddress, phoneNumber } = sellerPickup;
            const basePickup = { districtId, wardCode, businessAddress, phoneNumber: phoneNumber ?? "" };
            if (provinceId) {
              if (!cancelled) {
                setPickup({
                  provinceId,
                  ...basePickup,
                });
              }
            } else {
              // We only know district/ward/address – resolve province from cached GHN data
              if (!cancelled) {
                setPickup((prev) => ({
                  ...prev,
                  ...basePickup,
                }));
              }

              try {
                const resolvedProvinceId = await resolveProvinceIdFromDistrict(
                  districtId,
                  queryClient
                );
                if (!cancelled && resolvedProvinceId) {
                  setPickup({
                    provinceId: resolvedProvinceId,
                    ...basePickup,
                  });
                }
              } catch (err) {
                console.error("Error loading seller pickup address:", err);
              }
            }
          } else {
            // Fallback: sản phẩm từ chối / buyer không có Seller → lấy địa chỉ từ API
            const addresses = await AddressService.getAddresses();
            if (!cancelled && addresses.length > 0) {
              const defaultAddr =
                addresses.find((a) => a.isDefault) || addresses[0];
              const base: PickupFormValues = {
                provinceId: defaultAddr.provinceId ?? "",
                districtId: defaultAddr.districtId ?? "",
                wardCode: defaultAddr.wardCode ?? "",
                businessAddress: defaultAddr.specificAddress ?? "",
                phoneNumber: defaultAddr.phoneNumber ?? "",
              };
              const hasAll = base.provinceId && base.districtId && base.wardCode;
              if (hasAll) {
                setPickup(base);
              } else if (base.districtId && base.wardCode) {
                try {
                  const resolvedProvinceId = await resolveProvinceIdFromDistrict(
                    base.districtId,
                    queryClient
                  );
                  if (!cancelled && resolvedProvinceId) {
                    setPickup({
                      provinceId: resolvedProvinceId,
                      districtId: base.districtId,
                      wardCode: base.wardCode,
                      businessAddress: base.businessAddress,
                      phoneNumber: base.phoneNumber,
                    });
                  }
                } catch (err) {
                  console.error("Error resolving province for edit fallback:", err);
                }
              }
            }
          }
        }
      } catch (err) {
        if (cancelled) return;
        console.error("Error loading product:", err);
        toast.error("Không tải được thông tin sản phẩm");
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
  }, [isEditMode, editProductId, toast, router, showPickupSection, queryClient]);

  // 1) Fetch địa chỉ đã lưu (Address), set savedPickup = địa chỉ mặc định hoăc đầu tiên
  useEffect(() => {
    if (!showPickupSection) return;
    let cancelled = false;

    const loadSavedAddress = async () => {
      try {
        const addresses = await AddressService.getAddresses();
        if (cancelled || !addresses.length) return;
        const defaultAddress =
          addresses.find((addr) => addr.isDefault) || addresses[0];
        if (!cancelled && defaultAddress) {
          setSavedPickup(defaultAddress);
        }
      } catch {
        // im lặng, không block form
      }
    };

    void loadSavedAddress();

    return () => {
      cancelled = true;
    };
  }, [showPickupSection]);

  // 2) Pre-fill form từ savedPickup khi THÊM SẢN PHẨM MỚI (call API getAddresses đã chạy ở useEffect 1)
  useEffect(() => {
    if (!showPickupSection || !savedPickup || isEditMode) return;

    let cancelled = false;

    const initPickupFromSaved = async () => {
      const base: PickupFormValues = {
        provinceId: savedPickup.provinceId ?? "",
        districtId: savedPickup.districtId ?? "",
        wardCode: savedPickup.wardCode ?? "",
        businessAddress: savedPickup.specificAddress ?? "",
        phoneNumber: savedPickup.phoneNumber ?? "",
      };

      const hasProvince = !!base.provinceId;
      const hasDistrict = !!base.districtId;
      const hasWard = !!base.wardCode;

      if (hasProvince && hasDistrict && hasWard) {
        if (!cancelled) {
          setPickup(base);
        }
        return;
      }

      if (hasDistrict || hasWard || base.businessAddress) {
        if (!cancelled) {
          setPickup((prev) => ({
            ...prev,
            districtId: base.districtId,
            wardCode: base.wardCode,
            businessAddress: base.businessAddress,
          }));
        }
      }

      if (!hasDistrict || base.provinceId) return;

      try {
        const resolvedProvinceId = await resolveProvinceIdFromDistrict(
          base.districtId,
          queryClient
        );
        if (!cancelled && resolvedProvinceId) {
          setPickup({
            provinceId: resolvedProvinceId,
            districtId: base.districtId,
            wardCode: base.wardCode,
            businessAddress: base.businessAddress,
            phoneNumber: base.phoneNumber,
          });
        }
      } catch (err) {
        console.error("Error resolving province for saved pickup:", err);
      }
    };

    void initPickupFromSaved();

    return () => {
      cancelled = true;
    };
  }, [showPickupSection, savedPickup, isEditMode, queryClient]);

  const onPickupProvinceChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceId = e.target.value;
    setPickup((prev) => ({
      ...prev,
      provinceId,
      districtId: "",
      wardCode: "",
    }));
    setPickupErrors((prev) =>
      prev.provinceId ? { ...prev, provinceId: undefined } : prev
    );
  }, []);

  const onPickupDistrictChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtId = e.target.value;
    setPickup((prev) => ({ ...prev, districtId, wardCode: "" }));
    setPickupErrors((prev) => (prev.districtId ? { ...prev, districtId: undefined } : prev));
  }, []);

  const onPickupWardChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const wardCode = e.target.value;
    setPickup((prev) => ({ ...prev, wardCode }));
    setPickupErrors((prev) => (prev.wardCode ? { ...prev, wardCode: undefined } : prev));
  }, []);

  const onPickupBusinessAddressChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPickup((prev) => ({ ...prev, businessAddress: e.target.value }));
    setPickupErrors((prev) => (prev.businessAddress ? { ...prev, businessAddress: undefined } : prev));
  }, []);

  const onPickupPhoneNumberChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPickup((prev) => ({ ...prev, phoneNumber: e.target.value }));
    setPickupErrors((prev) => (prev.phoneNumber ? { ...prev, phoneNumber: undefined } : prev));
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setValues((prev) => ({
        ...prev,
        [name]: value,
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
      setValues((prev) => ({
        ...prev,
        attributes: prev.attributes.map((attr, i) =>
          i === index ? { ...attr, [field]: value } : attr
        ),
      }));
    },
    []
  );

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
    // Cho phép có ảnh cũ hoặc ảnh mới
    if (values.images.length === 0 && existingImageUrls.length === 0) {
      newErrors.images = "Vui lòng tải ít nhất 1 ảnh sản phẩm";
    }
    setErrors(newErrors);

    if (showPickupSection) {
      const pickupErr = validatePickupFields(pickup);
      setPickupErrors(pickupErr);
      if (Object.keys(pickupErr).length > 0) return false;
    }
    return Object.keys(newErrors).length === 0;
  }, [values, showPickupSection, pickup, existingImageUrls]);

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
          ...(showPickupSection &&
            pickup.provinceId &&
            pickup.districtId &&
            pickup.wardCode &&
            pickup.businessAddress?.trim() &&
            pickup.phoneNumber?.trim() && {
              pickupAddress: {
                provinceId: pickup.provinceId,
                districtId: pickup.districtId,
                wardCode: pickup.wardCode,
                businessAddress: pickup.businessAddress.trim(),
                phoneNumber: pickup.phoneNumber.trim(),
              },
            }),
        };

        if (isEditMode && editProductId) {
          // Update existing product
          const result = await ProductService.update(editProductId, payload);
          if (result.success) {
            // Auto request review if product is rejected and hasn't been requested yet
            const shouldAutoRequestReview = 
              currentProduct?.status === "rejected" && 
              !currentProduct?.aiModerationResult?.humanReviewRequested;
            
            if (shouldAutoRequestReview) {
              try {
                await ProductService.requestReview(editProductId);
                toast.success("Cập nhật và yêu cầu duyệt lại thành công! Admin sẽ xem xét trong 24h.");
              } catch {
                toast.success("Cập nhật sản phẩm thành công");
                toast.error("Không thể gửi yêu cầu duyệt lại. Vui lòng thử lại sau.");
              }
            } else {
              toast.success("Cập nhật sản phẩm thành công");
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
          // Create new product
          const result = await ProductService.create(payload);
          if (result.success) {
            toast.success("Đăng sản phẩm thành công");
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
      showPickupSection,
      pickup,
      isEditMode,
      editProductId,
      currentProduct,
    ]
  );

  const removeExistingImage = useCallback((index: number) => {
    setExistingImageUrls((prev) => prev.filter((_, i) => i !== index));
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
    selectedProvince,
    selectedDistrict,
    selectedWard,
    onPickupProvinceChange,
    onPickupDistrictChange,
    onPickupWardChange,
    onPickupBusinessAddressChange,
    onPickupPhoneNumberChange,
  };
}
