"use client";

import { FormEvent, useState } from "react";
import { AdminService } from "@/services/admin.service";
import { useQuery } from "@tanstack/react-query";

export default function AdminNotifications() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [targetBuyer, setTargetBuyer] = useState(true);
  const [targetSeller, setTargetSeller] = useState(true);
  const [targetAdmin, setTargetAdmin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [historyPage, setHistoryPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: history, refetch: refetchHistory, isLoading: historyLoading } = useQuery({
    queryKey: ["admin-broadcast-history", historyPage, startDate, endDate],
    queryFn: () =>
      AdminService.getBroadcastHistory({
        page: historyPage,
        limit: 10,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      }),
  });
  const historyItems = history?.data || [];
  const historyPagination = history?.pagination;
  const currentPage = historyPagination?.page ?? historyPage;
  const totalPages = historyPagination?.totalPages ?? 1;
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setResult("");

    if (!title.trim() || !message.trim()) {
      setError("Vui lòng nhập tiêu đề và nội dung thông báo.");
      return;
    }

    const targetRoles: Array<"buyer" | "seller" | "admin"> = [];
    if (targetBuyer) targetRoles.push("buyer");
    if (targetSeller) targetRoles.push("seller");
    if (targetAdmin) targetRoles.push("admin");

    if (targetRoles.length === 0) {
      setError("Vui lòng chọn ít nhất 1 nhóm người nhận.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await AdminService.broadcastSystemNotification({
        title: title.trim(),
        message: message.trim(),
        link: link.trim() || undefined,
        targetRoles,
      });
      setResult(`${res.message} (Đã gửi: ${res.sentCount})`);
      setTitle("");
      setMessage("");
      setLink("");
      void refetchHistory();
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message?: string }).message || "Gửi thông báo thất bại.")
          : "Gửi thông báo thất bại.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Thông báo hệ thống</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tạo thông báo broadcast gửi đến toàn bộ user theo nhóm vai trò.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-xl border border-border bg-card p-4 shadow-sm"
      >
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Tiêu đề</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            placeholder="Ví dụ: Khuyến mãi cuối tuần"
            maxLength={120}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Nội dung</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[120px] w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            placeholder="Nội dung thông báo gửi cho người dùng..."
            maxLength={1000}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Đường dẫn (tuỳ chọn)</label>
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            placeholder="/products hoặc /orders"
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Nhóm người nhận</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={targetBuyer}
                onChange={(e) => setTargetBuyer(e.target.checked)}
              />
              Buyer
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={targetSeller}
                onChange={(e) => setTargetSeller(e.target.checked)}
              />
              Seller
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={targetAdmin}
                onChange={(e) => setTargetAdmin(e.target.checked)}
              />
              Admin
            </label>
          </div>
        </div>

        {error ? (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        {result ? (
          <div className="rounded-lg border border-emerald-600/30 bg-emerald-600/10 px-3 py-2 text-sm text-emerald-700">
            {result}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
        >
          {isSubmitting ? "Đang gửi..." : "Gửi thông báo"}
        </button>
      </form>

      <div className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Lịch sử broadcast</h2>
          <p className="text-xs text-muted-foreground">
            {history?.pagination?.total ?? 0} bản ghi
          </p>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setHistoryPage(1);
              setStartDate(e.target.value);
            }}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setHistoryPage(1);
              setEndDate(e.target.value);
            }}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>

        {historyLoading ? (
          <p className="text-sm text-muted-foreground">Đang tải lịch sử...</p>
        ) : historyItems.length ? (
          <div className="space-y-2">
            {historyItems.map((item) => (
              <div key={item._id} className="rounded-lg border border-border p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.message}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(item.createdAt).toLocaleString("vi-VN")}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span>Nhóm: {(item.targetRoles || []).join(", ")}</span>
                  <span>•</span>
                  <span>Đã gửi: {item.sentCount}</span>
                  {item.createdBy?.fullName || item.createdBy?.email ? (
                    <>
                      <span>•</span>
                      <span>
                        Bởi: {item.createdBy?.fullName || item.createdBy?.email}
                      </span>
                    </>
                  ) : null}
                </div>
              </div>
            ))}

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setHistoryPage((p) => Math.max(1, p - 1))}
                disabled={!canGoPrev}
                className="rounded border border-border px-3 py-1 text-xs disabled:opacity-50"
              >
                Trước
              </button>
              <span className="text-xs text-muted-foreground">
                Trang {currentPage}/{totalPages}
              </span>
              <button
                type="button"
                onClick={() => setHistoryPage((p) => Math.min(totalPages, p + 1))}
                disabled={!canGoNext}
                className="rounded border border-border px-3 py-1 text-xs disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Chưa có lịch sử broadcast.</p>
        )}
      </div>
    </div>
  );
}

