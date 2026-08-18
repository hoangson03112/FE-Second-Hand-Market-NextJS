"use client";

import {
  IconCopy,
  IconMail,
  IconMapPin,
  IconMessage,
  IconPhone,
} from "@tabler/icons-react";
import {
  Panel,
  microCaps,
  outlineAction,
} from "@/features/order/components";
import { AvatarOrInitials } from "@/components/ui/AvatarOrInitials";
import { cn } from "@/lib/utils";
import type { Order } from "@/types/order";

interface SellerBuyerCardProps {
  order: Order;
  isLocalPickup: boolean;
  onChatClick: () => void;
}

/** Hairline contact row that fills with ink on hover, like every other action. */
function ContactRow({
  icon: Icon,
  label,
  value,
  href,
  onCopy,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  href: string;
  onCopy?: () => void;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <a
        href={href}
        className="group flex min-w-0 flex-1 items-center gap-3 rounded-[2px] border border-luxury-ink/12 bg-cream-50/60 px-3.5 py-3 transition-colors duration-300 hover:border-luxury-ink/30 hover:bg-cream-100"
      >
        <Icon className="h-4 w-4 shrink-0 text-luxury-ink/50 transition-colors group-hover:text-luxury-ink" />
        <span className="min-w-0">
          <span className={cn(microCaps, "block text-neutral-500")}>
            {label}
          </span>
          <span className="mt-1 block truncate text-sm tabular-nums text-luxury-ink">
            {value}
          </span>
        </span>
      </a>
      {onCopy ? (
        <button
          type="button"
          onClick={onCopy}
          title={`Sao chép ${label.toLowerCase()}`}
          aria-label={`Sao chép ${label.toLowerCase()}`}
          className="shrink-0 rounded-[2px] border border-luxury-ink/12 p-3 text-luxury-ink/50 transition-colors duration-300 hover:border-luxury-ink/30 hover:text-luxury-ink"
        >
          <IconCopy className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}

export function SellerBuyerCard({
  order,
  isLocalPickup,
  onChatClick,
}: SellerBuyerCardProps) {
  const buyer = order.buyerId;
  const address = order.shippingAddress;
  /* The delivery contact is often not the account holder, so it is worth
     repeating rather than making the seller guess. */
  const recipientDiffers =
    address && address.fullName && address.fullName !== buyer?.fullName;

  return (
    <Panel eyebrow="Người mua" title={buyer?.fullName || "—"}>
      <div className="flex items-center gap-3.5">
        <AvatarOrInitials
          avatar={(buyer as { avatar?: { url?: string } })?.avatar}
          fullName={buyer?.fullName}
          size={44}
          className="shrink-0"
        />
        <div className="min-w-0">
          <p className={cn(microCaps, "text-neutral-500")}>Tài khoản</p>
          <p className="mt-1 truncate text-sm text-luxury-ink">
            {buyer?.email || "—"}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {buyer?.phoneNumber ? (
          <ContactRow
            icon={IconPhone}
            label="Điện thoại"
            value={buyer.phoneNumber}
            href={`tel:${buyer.phoneNumber}`}
            onCopy={() => navigator.clipboard.writeText(buyer.phoneNumber)}
          />
        ) : null}
        {buyer?.email ? (
          <ContactRow
            icon={IconMail}
            label="Email"
            value={buyer.email}
            href={`mailto:${buyer.email}`}
          />
        ) : null}
      </div>

      {address && (recipientDiffers || isLocalPickup) ? (
        <div className="mt-5 border-t border-luxury-ink/8 pt-5">
          <p className={cn(microCaps, "text-neutral-500")}>
            {isLocalPickup ? "Liên hệ nhận hàng" : "Người nhận hàng"}
          </p>
          <p className="mt-2 text-sm font-medium text-luxury-ink">
            {address.fullName}
            {address.phoneNumber ? (
              <>
                <span aria-hidden className="mx-2 text-luxury-ink/25">
                  ·
                </span>
                <a
                  href={`tel:${address.phoneNumber}`}
                  className="tabular-nums transition-colors hover:text-taupe-700"
                >
                  {address.phoneNumber}
                </a>
              </>
            ) : null}
          </p>
          {!isLocalPickup ? (
            <p className="mt-2 flex gap-2 text-xs leading-relaxed text-neutral-600">
              <IconMapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-luxury-ink/40" />
              {[
                address.specificAddress,
                address.ward,
                address.district,
                address.province,
              ]
                .filter(Boolean)
                .join(", ")}
            </p>
          ) : null}
        </div>
      ) : null}

      <button
        type="button"
        onClick={onChatClick}
        className={cn(outlineAction, "mt-5 w-full")}
      >
        <IconMessage className="h-4 w-4" />
        Nhắn tin người mua
      </button>
    </Panel>
  );
}
