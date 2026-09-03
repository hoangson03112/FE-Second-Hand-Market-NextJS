"use client";

import {
  IconRobot,
  IconLoader2,
  IconActivity,
  IconShield,
  IconArrowRight,
  IconCheck,
  IconX,
  IconAlertTriangle,
} from "@tabler/icons-react";
import Link from "next/link";
import { useAdminModeration } from "./hooks/useAdminModeration";
import StatCard from "./components/StatCard";
import { PageHeader, ErrorState } from "@/features/admin/components";

export default function AdminModeration() {
  const { statusStats, aiStats, needsReview, isLoading, error } =
    useAdminModeration();

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <IconLoader2 className="h-9 w-9 animate-spin text-luxury-ink" />
          <p className="text-2xs font-bold uppercase tracking-[0.2em] text-neutral-500">
            Đang tải dữ liệu kiểm duyệt AI...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Không tải được thống kê kiểm duyệt"
        description="Vui lòng kiểm tra quyền đăng nhập tài khoản quản trị viên."
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Tự động hoá AI"
        title="Kiểm duyệt nội dung tự động AI"
        description="Thống kê hiệu quả phân tích hình ảnh và văn bản của AI trong việc phát hiện sản phẩm vi phạm."
        badge={
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[2px] text-2xs font-bold uppercase tracking-[0.16em] bg-cream-50 text-luxury-ink border border-luxury-ink/10">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            AI Guard Active
          </span>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={<IconActivity className="h-4 w-4" />}
          title="Cần admin review thủ công"
        >
          <div className="space-y-2">
            <p className="font-droid-serif text-3xl font-bold text-amber-700 tabular-nums">
              {needsReview}
            </p>
            <p className="text-xs text-neutral-500">
              Sản phẩm có độ tin cậy AI trung bình cần người thật xác minh
            </p>
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1 text-2xs font-bold uppercase tracking-[0.12em] text-luxury-ink hover:text-accent pt-1 transition-colors"
            >
              Mở danh sách duyệt →
            </Link>
          </div>
        </StatCard>

        <StatCard
          icon={<IconRobot className="h-4 w-4" />}
          title="Phân loại theo trạng thái"
        >
          <div className="space-y-2">
            {statusStats.length ? (
              <div className="space-y-1.5">
                {statusStats.map((s: { _id: string; count: number }) => (
                  <div
                    key={s._id}
                    className="flex items-center justify-between text-xs p-2.5 rounded-[2px] bg-cream-50/60 border border-luxury-ink/6"
                  >
                    <span className="text-neutral-500 font-bold text-2xs uppercase tracking-[0.1em]">
                      {s._id}
                    </span>
                    <span className="font-droid-serif font-bold text-luxury-ink tabular-nums text-sm">
                      {s.count}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-400">Chưa có dữ liệu phân loại</p>
            )}
          </div>
        </StatCard>

        <StatCard
          icon={<IconShield className="h-4 w-4" />}
          title="Kết quả kiểm định AI"
        >
          <div className="space-y-2">
            {aiStats.length ? (
              <div className="space-y-1.5">
                {aiStats.map((s: { _id: boolean; count: number }) => {
                  const isApproved = s._id === true;
                  return (
                    <div
                      key={String(s._id)}
                      className={`flex items-center justify-between text-xs p-2.5 rounded-[2px] border ${
                        isApproved
                          ? "bg-white text-accent border-accent/30"
                          : "bg-white text-rose-700 border-rose-200"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-2xs font-bold uppercase tracking-[0.1em]">
                        {isApproved ? (
                          <IconCheck className="w-3.5 h-3.5 text-accent" />
                        ) : (
                          <IconX className="w-3.5 h-3.5 text-rose-600" />
                        )}
                        <span>{isApproved ? "AI Đề xuất duyệt" : "AI Cảnh báo vi phạm"}</span>
                      </div>
                      <span className="font-droid-serif font-bold tabular-nums text-sm">{s.count}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-neutral-400">Chưa có kết quả AI</p>
            )}
          </div>
        </StatCard>
      </div>

      <div className="rounded-[2px] border border-luxury-ink/10 bg-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-droid-serif text-base font-bold text-luxury-ink">
            Cần xem xét và thẩm định các sản phẩm đang chờ?
          </h3>
          <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
            Chuyển tới bảng kiểm duyệt sản phẩm để xem ảnh chi tiết, phân tích AI và quyết định duyệt hoặc từ chối.
          </p>
        </div>
        <Link
          href="/admin/products"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-[2px] bg-luxury-ink text-luxury-ivory text-2xs font-bold uppercase tracking-[0.14em] hover:bg-charcoal-800 transition-all shrink-0"
        >
          Đi tới Kiểm duyệt sản phẩm
          <IconArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

