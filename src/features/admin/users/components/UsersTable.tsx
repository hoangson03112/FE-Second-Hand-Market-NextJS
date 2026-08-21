"use client";

import { IconBan, IconLockOpen } from "@tabler/icons-react";

import type { AdminAccount } from "@/types/admin";
import { format } from "@/utils/format/date";
import { ToneBadge, type StatusTone } from "@/components/ui";
import { DataTable, type DataTableColumn } from "@/features/admin/components";
import { Button } from "@/components/ui/button";
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

const ROLE_TONES: Record<string, StatusTone> = {
  admin: "default",
  seller: "info",
  buyer: "muted",
};

const STATUS_TONES: Record<string, StatusTone> = {
  active: "success",
  inactive: "warning",
  banned: "error",
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
            <Avatar className="size-9">
              <AvatarImage src={acc.avatar?.url} alt={name} />
              <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="max-w-[160px] truncate font-medium text-foreground sm:max-w-[220px]">
                  {acc.fullName ?? "—"}
                </span>
                <ToneBadge
                  tone={ROLE_TONES[acc.role ?? "buyer"] ?? "muted"}
                  dot={false}
                  className="text-2xs"
                >
                  {ROLE_LABELS[acc.role ?? "buyer"] ?? acc.role}
                </ToneBadge>
              </div>
              <p className="max-w-[220px] truncate text-xs text-muted-foreground">
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
      cell: (acc) => <span className="text-muted-foreground">{acc.email}</span>,
    },
    {
      key: "phone",
      header: "Số điện thoại",
      className: "hidden text-muted-foreground sm:table-cell",
      headerClassName: "hidden sm:table-cell",
      cell: (acc) => acc.phoneNumber ?? "—",
    },
    {
      key: "createdAt",
      header: "Ngày tạo",
      className: "hidden text-xs text-muted-foreground md:table-cell",
      headerClassName: "hidden md:table-cell",
      cell: (acc) => (acc.createdAt ? format(acc.createdAt) : "—"),
    },
    {
      key: "status",
      header: "Trạng thái",
      className: "hidden sm:table-cell",
      headerClassName: "hidden sm:table-cell",
      cell: (acc) => (
        <ToneBadge tone={STATUS_TONES[acc.status ?? "active"] ?? "muted"}>
          {STATUS_LABELS[acc.status ?? "active"] ?? acc.status ?? "—"}
        </ToneBadge>
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
          <Button
            variant="ghost"
            size="sm"
            disabled={isUpdating}
            onClick={() => onUnban?.(acc)}
            className="text-emerald-600 hover:text-emerald-700"
          >
            <IconLockOpen className="size-4 mr-2" />
            Mở khóa
          </Button>
        ) : acc.role !== "admin" ? (
          <Button
            variant="ghost"
            size="sm"
            disabled={isUpdating}
            onClick={() => onBan?.(acc)}
            className="text-destructive hover:text-destructive"
          >
            <IconBan className="size-4 mr-2" />
            Khóa
          </Button>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
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
