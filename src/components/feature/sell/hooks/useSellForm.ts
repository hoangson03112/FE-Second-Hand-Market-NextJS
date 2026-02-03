"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ProductService, type CreateProductPayload } from "@/services/product.service";
import { PickupAddressService } from "@/services/pickupAddress.service";
import { useUser } from "@/hooks/useUser";
import { useProvinces, useDistricts, useWards } from "@/hooks/useGHNLocation";
import type { PickupAddressData } from "@/types/pickupAddress";

export type ProductAttribute = { key: string; value: string };

export type SellFormValues = {
  name: string;
  price: string;
  stock: string;
  description: string;
  categoryId: string;
  subcategoryId: string;
  condition: "new" | "like_new" | "good" | "fair" | "poor";
  images: File[];
  video: File | null;
  attributes: ProductAttribute[];
};

/** Địa chỉ lấy hàng (cho user chưa verify seller) */
export type PickupFormValues = {
  provinceId: string;
  districtId: string;
  wardCode: string;
  businessAddress: string;
};

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
};

export function useSellForm() {
  const router = useRouter();
  const { data: account } = useUser();
  const [values, setValues] = useState<SellFormValues>(INITIAL);
  const [pickup, setPickup] = useState<PickupFormValues>(PICKUP_INITIAL);
  const [savedPickup, setSavedPickup] = useState<PickupAddressData | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof SellFormValues, string>>>({});
  const [pickupErrors, setPickupErrors] = useState<Partial<Record<keyof PickupFormValues, string>>>({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    if (!showPickupSection) return;
    let cancelled = false;
    PickupAddressService.get()
      .then((res) => {
        if (cancelled || !res.hasAddress || !res.data) return;
        setSavedPickup(res.data);
        setPickup((prev) => ({ ...prev, businessAddress: res.data!.businessAddress }));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [showPickupSection]);

  const onPickupProvinceChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceId = e.target.value;
    const province = provinces.find((p) => String(p.ProvinceID) === provinceId) ?? null;
    setPickup((prev) => ({
      ...prev,
      provinceId,
      districtId: "",
      wardCode: "",
    }));
    setPickupErrors((prev) => (prev.provinceId ? { ...prev, provinceId: undefined } : prev));
  }, [provinces]);

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
    if (values.images.length === 0) newErrors.images = "Vui lòng tải ít nhất 1 ảnh sản phẩm";
    setErrors(newErrors);

    if (showPickupSection) {
      const pickupErr: Partial<Record<keyof PickupFormValues, string>> = {};
      if (!pickup.provinceId) pickupErr.provinceId = "Vui lòng chọn Tỉnh/Thành phố";
      if (!pickup.districtId) pickupErr.districtId = "Vui lòng chọn Quận/Huyện";
      if (!pickup.wardCode) pickupErr.wardCode = "Vui lòng chọn Phường/Xã";
      if (!pickup.businessAddress?.trim()) pickupErr.businessAddress = "Vui lòng nhập địa chỉ cụ thể";
      setPickupErrors(pickupErr);
      if (Object.keys(pickupErr).length > 0) return false;
    }
    return Object.keys(newErrors).length === 0;
  }, [values, showPickupSection, pickup]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setApiError("");
      if (!validate()) return;

      setIsLoading(true);
      try {
        if (showPickupSection && selectedProvince && selectedDistrict && selectedWard) {
          const pickupPayload = {
            province: selectedProvince.ProvinceName,
            district: selectedDistrict.DistrictName,
            ward: selectedWard.WardName,
            from_district_id: String(pickup.districtId),
            from_ward_code: pickup.wardCode,
            businessAddress: pickup.businessAddress.trim(),
          };
          const upsertRes = await PickupAddressService.upsert(pickupPayload);
          if (!upsertRes.success) {
            setApiError(upsertRes.message ?? "Lưu địa chỉ lấy hàng thất bại.");
            return;
          }
        }

        const attributesFiltered = values.attributes.filter(
          (a) => a.key.trim() && a.value.trim()
        );
        const payload: CreateProductPayload = {
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
        };
        const result = await ProductService.create(payload);
        if (result.success) {
          router.push("/sell/success");
        } else {
          setApiError("Đăng sản phẩm thất bại. Vui lòng thử lại.");
        }
      } catch (err: unknown) {
        const ax = err as { response?: { data?: { message?: string } } };
        setApiError(
          (ax.response?.data as { message?: string })?.message ?? "Có lỗi xảy ra. Vui lòng thử lại."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [
      values,
      validate,
      router,
      showPickupSection,
      pickup,
      selectedProvince,
      selectedDistrict,
      selectedWard,
    ]
  );

  return {
    values,
    setValues,
    errors,
    apiError,
    isLoading,
    handleChange,
    setImages,
    setVideo,
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
  };
}
