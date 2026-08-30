"use client";

import { FormEvent, useState } from "react";
import { AdminService } from "@/services/admin.service";
import { useQuery } from "@tanstack/react-query";
import {
  IconSend,
  IconClock,
  IconUsers,
  IconBell,
  IconCheck,
  IconAlertTriangle,
  IconLoader2,
  IconCalendar,
} from "@tabler/icons-react";
import { PageHeader, NoData } from "@/features/admin/components";

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

  const {
    data: history,
    refetch: refetchHistory,
    isLoading: historyLoading,
  } = useQuery({
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

  const handleSubmit = async (e: FormEvent) => {
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
      setResult(`${res.message} (Đã gửi thành công tới ${res.sentCount} tài khoản)`);
      setTitle("");
      setMessage("");
      setLink("");
      void refetchHistory();
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String(
              (err as { message?: string }).message ||
                "Gửi thông báo thất bại.",
            )
          : "Gửi thông báo thất bại.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Thông báo hệ thống (Broadcast)"
        description="Soạn và phát đi thông báo trực tiếp tới hàng loạt người dùng theo từng nhóm vai trò."
        badge={
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <IconBell className="w-3.5 h-3.5" />
            Toàn hệ thống
          </span>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form soạn thông báo */}
        <div className="lg:col-span-6 space-y-4">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs"
          >
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <IconSend className="w-4 h-4 text-primary" />
              Soạn thông báo mới
            </h2>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Tiêu đề thông báo
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted-foreground transition-all"
                placeholder="Ví dụ: Cập nhật chính sách hoàn tiền mới"
                maxLength={120}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Nội dung chi tiết
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[120px] w-full rounded-xl border border-border/80 bg-background px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted-foreground transition-all"
                placeholder="Nội dung thông báo gửi cho người dùng..."
                maxLength={1000}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Đường dẫn liên kết (tuỳ chọn)
              </label>
              <input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted-foreground transition-all"
                placeholder="/products hoặc /orders hoặc liên kết ngoài"
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-border/60">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Nhóm đối tượng nhận tin
              </p>
              <div className="flex flex-wrap gap-2.5">
                <label
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                    targetBuyer
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-background border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={targetBuyer}
                    onChange={(e) => setTargetBuyer(e.target.checked)}
                    className="sr-only"
                  />
                  {targetBuyer && <IconCheck className="w-3.5 h-3.5" />}
                  Người mua (Buyer)
                </label>

                <label
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                    targetSeller
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-background border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={targetSeller}
                    onChange={(e) => setTargetSeller(e.target.checked)}
                    className="sr-only"
                  />
                  {targetSeller && <IconCheck className="w-3.5 h-3.5" />}
                  Người bán (Seller)
                </label>

                <label
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                    targetAdmin
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-background border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={targetAdmin}
                    onChange={(e) => setTargetAdmin(e.target.checked)}
                    className="sr-only"
                  />
                  {targetAdmin && <IconCheck className="w-3.5 h-3.5" />}
                  Quản trị viên (Admin)
                </label>
              </div>
            </div>

            {error ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 font-medium flex items-center gap-2">
                <IconAlertTriangle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            ) : null}

            {result ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700 font-medium flex items-center gap-2">
                <IconCheck className="w-4 h-4 shrink-0" />
                {result}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-all shadow-2xs"
            >
              {isSubmitting ? (
                <>
                  <IconLoader2 className="w-4 h-4 animate-spin" />
                  Đang phát thông báo...
                </>
              ) : (
                <>
                  <IconSend className="w-4 h-4" />
                  Gửi thông báo ngay
                </>
              )}
            </button>
          </form>
        </div>

        {/* Lịch sử phát sóng */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                <IconClock className="w-4 h-4 text-primary" />
                Lịch sử thông báo đã gửi
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                {history?.pagination?.total ?? 0} bản ghi
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setHistoryPage(1);
                    setStartDate(e.target.value);
                  }}
                  className="w-full rounded-xl border border-border/80 bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div className="relative">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setHistoryPage(1);
                    setEndDate(e.target.value);
                  }}
                  className="w-full rounded-xl border border-border/80 bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            {historyLoading ? (
              <div className="flex items-center justify-center py-10">
                <IconLoader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : historyItems.length ? (
              <div className="space-y-3">
                {historyItems.map((item) => (
                  <div
                    key={item._id}
                    className="rounded-xl border border-border/80 bg-background/50 p-3.5 space-y-2 hover:border-primary/20 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold text-foreground">
                          {item.title}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                          {item.message}
                        </p>
                      </div>
                      <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleString("vi-VN")}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                      <span className="inline-block px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">
                        {(item.targetRoles || []).join(", ")}
                      </span>
                      <span>•</span>
                      <span>Đã gửi: <strong className="text-foreground">{item.sentCount}</strong></span>
                      {item.createdBy?.fullName || item.createdBy?.email ? (
                        <>
                          <span>•</span>
                          <span>Bởi: {item.createdBy?.fullName || item.createdBy?.email}</span>
                        </>
                      ) : null}
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setHistoryPage((p) => Math.max(1, p - 1))}
                    disabled={!canGoPrev}
                    className="rounded-lg border border-border/80 px-2.5 py-1 text-xs font-medium hover:bg-muted disabled:opacity-40 transition-colors"
                  >
                    Trước
                  </button>
                  <span className="text-xs text-muted-foreground">
                    Trang {currentPage}/{totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setHistoryPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={!canGoNext}
                    className="rounded-lg border border-border/80 px-2.5 py-1 text-xs font-medium hover:bg-muted disabled:opacity-40 transition-colors"
                  >
                    Sau
                  </button>
                </div>
              </div>
            ) : (
              <NoData
                icon={<IconBell className="w-8 h-8 text-muted-foreground" />}
                title="Chưa có lịch sử broadcast"
                description="Các thông báo bạn gửi sẽ được lưu lại ở đây."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
