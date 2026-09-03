"use client";

import { IconBan, IconLockOpen } from "@tabler/icons-react";

import type { AdminAccount } from "@/types/admin";
import { format } from "@/utils/format/date";
import { DataTable, type DataTableColumn } from "@/features/admin/components";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ROLE_LABELS: Record<string, string> = {
  admin: "Quản trị viên",
  seller: "Người bán",
  buyer: "Người mua",
};

const STATUS_LABELS: Record<string, string> = {
  active: "Hoạt động",
  inactive: "Chưa kích hoạt",
  banned: "Bị khóa",
};

const ROLE_BADGE: Record<string, string> = {
  admin: "bg-cream-50 text-luxury-ink border border-luxury-ink/10",
  seller: "bg-cream-50 text-accent border border-accent/30",
  buyer: "bg-neutral-100 text-neutral-600 border border-neutral-200",
};

const STATUS_BADGE: Record<string, string> = {
  active: "bg-cream-50 text-accent border border-accent/30",
  inactive: "bg-amber-50 text-amber-700 border border-amber-200",
  banned: "bg-rose-50 text-rose-700 border border-rose-200",
};

interface UsersTableProps {
  accounts: AdminAccount[];
  isUpdating?: boolean;
  loading?: boolean;
  onBan?: (account: AdminAccount) => void;
  onUnban?: (account: AdminAccount) => void;
}

export default function UsersTable({
  accounts,
  isUpdating,
  loading,
  onBan,
  onUnban,
}: UsersTableProps) {
  const columns: DataTableColumn<AdminAccount>[] = [
    {
      key: "user",
      header: "Người dùng",
      cell: (acc) => {
        const name = acc.fullName ?? acc.email;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="size-8 rounded-[2px] border border-luxury-ink/10">
              <AvatarImage src={acc.avatar?.url} alt={name} className="rounded-[2px] object-cover" />
              <AvatarFallback className="rounded-[2px] bg-cream-50 text-luxury-ink font-bold text-xs">
                {name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="max-w-[160px] truncate font-semibold text-luxury-ink text-xs sm:max-w-[220px]">
                  {acc.fullName ?? "—"}
                </span>
                <span
                  className={`inline-flex px-2 py-0.5 rounded-[2px] text-2xs font-bold uppercase tracking-[0.1em] ${
                    ROLE_BADGE[acc.role ?? "buyer"] ?? ROLE_BADGE.buyer
                  }`}
                >
                  {ROLE_LABELS[acc.role ?? "buyer"] ?? acc.role}
                </span>
              </div>
              <p className="max-w-[220px] truncate text-xs text-neutral-400">
                {acc.email}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      key: "email",
      header: "Email",
      cell: (acc) => <span className="text-neutral-500 text-xs">{acc.email}</span>,
    },
    {
      key: "phone",
      header: "Số điện thoại",
      className: "hidden text-neutral-500 text-xs sm:table-cell",
      headerClassName: "hidden sm:table-cell",
      cell: (acc) => acc.phoneNumber ?? "—",
    },
    {
      key: "createdAt",
      header: "Ngày tạo",
      className: "hidden text-xs text-neutral-500 md:table-cell",
      headerClassName: "hidden md:table-cell",
      cell: (acc) => (acc.createdAt ? format(acc.createdAt) : "—"),
    },
    {
      key: "status",
      header: "Trạng thái",
      className: "hidden sm:table-cell",
      headerClassName: "hidden sm:table-cell",
      cell: (acc) => (
        <span
          className={`inline-flex px-2.5 py-0.5 rounded-[2px] text-2xs font-bold uppercase tracking-[0.1em] ${
            STATUS_BADGE[acc.status ?? "active"] ?? STATUS_BADGE.active
          }`}
        >
          {STATUS_LABELS[acc.status ?? "active"] ?? acc.status ?? "—"}
        </span>
      ),
    },
  ];

  if (onBan || onUnban) {
    columns.push({
      key: "actions",
      header: "Thao tác",
      align: "right",
      cell: (acc) =>
        acc.status === "banned" ? (
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => onUnban?.(acc)}
            className="inline-flex items-center gap-1.5 rounded-[2px] border border-accent/30 bg-white px-3 py-1.5 text-2xs font-bold uppercase tracking-[0.12em] text-accent hover:bg-cream-50 transition-colors disabled:opacity-50"
          >
            <IconLockOpen className="size-3.5" />
            Mở khóa
          </button>
        ) : acc.role !== "admin" ? (
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => onBan?.(acc)}
            className="inline-flex items-center gap-1.5 rounded-[2px] border border-rose-200 bg-white px-3 py-1.5 text-2xs font-bold uppercase tracking-[0.12em] text-rose-700 hover:bg-rose-50 transition-colors disabled:opacity-50"
          >
            <IconBan className="size-3.5" />
            Khóa
          </button>
        ) : (
          <span className="text-2xs text-neutral-400">—</span>
        ),
    });
  }

  return (
    <DataTable
      columns={columns}
      data={accounts}
      loading={loading}
      getRowId={(acc) => acc._id}
    />
  );
}
