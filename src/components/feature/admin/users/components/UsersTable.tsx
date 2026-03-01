import type { AdminAccount } from "@/types/admin";
import { format } from "@/utils/format/date";

const ROLE_LABELS: Record<string, string> = {
  admin: "Quản trị viên",
  seller: "Người bán",
  buyer: "Người mua",
};

const ROLE_BADGE_STYLES: Record<string, { className: string }> = {
  admin: {
    className:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200",
  },
  seller: {
    className:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
  },
  buyer: {
    className:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  },
};

function getRoleLabel(role?: string) {
  if (!role) return "Người mua";
  return ROLE_LABELS[role] ?? role;
}

function getRoleBadgeClass(role?: string) {
  if (!role) return ROLE_BADGE_STYLES.buyer.className;
  return ROLE_BADGE_STYLES[role]?.className ?? "bg-muted text-muted-foreground";
}

interface UsersTableProps {
  accounts: AdminAccount[];
}

export default function UsersTable({ accounts }: UsersTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-foreground">
                Người dùng
              </th>
              <th className="text-left px-4 py-3 font-medium text-foreground">
                Email
              </th>
              <th className="text-left px-4 py-3 font-medium text-foreground hidden sm:table-cell">
                Số điện thoại
              </th>
              <th className="text-left px-4 py-3 font-medium text-foreground hidden md:table-cell">
                Ngày tạo
              </th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((acc: AdminAccount) => (
              <tr
                key={acc._id}
                className="border-b border-border last:border-0 hover:bg-muted/30"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full border border-border bg-muted overflow-hidden shrink-0">
                      {acc.avatar?.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={acc.avatar.url}
                          alt={acc.fullName ?? acc.email}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[11px] font-semibold text-muted-foreground">
                          {(acc.fullName ?? acc.email).charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground truncate max-w-[160px] sm:max-w-[220px]">
                          {acc.fullName ?? "—"}
                        </span>
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${getRoleBadgeClass(
                            acc.role
                          )}`}
                        >
                          {getRoleLabel(acc.role)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate max-w-[220px]">
                        {acc.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {acc.email}
                </td>
                <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">
                  {acc.phoneNumber ?? "—"}
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-muted-foreground text-xs">
                  {acc.createdAt ? format(acc.createdAt) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
