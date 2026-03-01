"use client";

import type { IProduct } from "@/types/product";
import {
  useProvinces,
  useDistricts,
  useWards,
} from "@/hooks/useGHNLocation";

type Props = {
  address: NonNullable<IProduct["address"]>;
  sellerName?: string;
};

export function AddressDetail({ address, sellerName: _sellerName }: Props) {
  const { data: provinces = [] } = useProvinces();
  const { data: districts = [] } = useDistricts(address.provinceId);
  const { data: wards = [] } = useWards(address.districtId);

  const provinceName = provinces.find(
    (p) => String(p.ProvinceID) === String(address.provinceId)
  )?.ProvinceName;
  const districtName = districts.find(
    (d) => String(d.DistrictID) === String(address.districtId)
  )?.DistrictName;
  const wardName = wards.find((w) => w.WardCode === address.wardCode)?.WardName;

  const rows = [
    { label: "Liên hệ", value: address.fullName },
    { label: "SĐT", value: address.phoneNumber },
    { label: "Địa chỉ", value: address.specificAddress },
    {
      label: "Tỉnh/TP",
      value: provinceName ?? (address.provinceId ? String(address.provinceId) : undefined),
    },
    {
      label: "Quận/Huyện",
      value: districtName ?? (address.districtId ? String(address.districtId) : undefined),
    },
    {
      label: "Phường/Xã",
      value: wardName ?? address.wardCode,
    },
  ];

  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-2">
      {rows.map(({ label, value }) => (
        <div key={label}>
          <dt className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
            {label}
          </dt>
          <dd className="mt-0.5 text-sm text-foreground">{value || "—"}</dd>
        </div>
      ))}
    </dl>
  );
}
