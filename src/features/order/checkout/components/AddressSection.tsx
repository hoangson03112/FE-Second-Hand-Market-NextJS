"use client";

import { IconMapPin, IconEdit, IconPlus } from "@tabler/icons-react";
import { Address } from "@/types/address";

interface AddressSectionProps {
  selectedAddress?: Address | null;
  onChangeAddress: () => void;
}

const formatAddress = (address: Address | null) => {
  if (!address) return "";
  const parts = [
    address.specificAddress || address.address,
    address.ward,
    address.district,
    address.province,
  ].filter(Boolean);
  return parts.join(", ");
};

const iconTile =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-[2px] border border-luxury-ink/10 bg-cream-50";

const inkButton =
  "group inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-[2px] bg-luxury-ink px-5 text-2xs font-bold uppercase tracking-[0.15em] text-luxury-ivory transition-all duration-300 hover:bg-charcoal-800";

const outlineButton =
  "inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-[2px] border border-luxury-ink/15 px-5 text-2xs font-bold uppercase tracking-[0.15em] text-luxury-ink transition-all duration-300 hover:border-luxury-ink hover:bg-luxury-ink hover:text-luxury-ivory";

export default function AddressSection({
  selectedAddress = null,
  onChangeAddress,
}: AddressSectionProps) {
  if (!selectedAddress) {
    return (
      <div className="flex flex-col gap-5 rounded-[2px] border border-dashed border-luxury-ink/15 bg-cream-50/50 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className={iconTile}>
            <IconMapPin className="h-4 w-4 text-luxury-ink" />
          </span>
          <div>
            <p className="text-sm font-medium text-luxury-ink">
              Chưa có địa chỉ giao hàng
            </p>
            <p className="mt-1 text-xs leading-relaxed text-neutral-600">
              Thêm một địa chỉ để tiếp tục đặt hàng.
            </p>
          </div>
        </div>
        <button type="button" onClick={onChangeAddress} className={inkButton}>
          <IconPlus className="h-3.5 w-3.5" />
          Thêm địa chỉ
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 gap-4">
        <span className={iconTile}>
          <IconMapPin className="h-4 w-4 text-luxury-ink" />
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-bold text-luxury-ink">
              {selectedAddress.fullName}
            </span>
            <span aria-hidden className="h-3 w-px bg-luxury-ink/15" />
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] tabular-nums text-neutral-600">
              {selectedAddress.phoneNumber}
            </span>
            {selectedAddress.isDefault ? (
              <span className="rounded-[2px] border border-luxury-champagne/50 bg-cream-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-700">
                Mặc định
              </span>
            ) : null}
          </div>
          <p className="mt-2.5 text-sm leading-relaxed text-neutral-600">
            {formatAddress(selectedAddress)}
          </p>
        </div>
      </div>

      <button type="button" onClick={onChangeAddress} className={outlineButton}>
        <IconEdit className="h-3.5 w-3.5" />
        Thay đổi
      </button>
    </div>
  );
}
