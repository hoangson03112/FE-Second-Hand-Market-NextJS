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
          <IconLoader2 className="h-9 w-9 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">
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
        title="Kiểm duyệt nội dung tự động AI"
        description="Thống kê hiệu quả phân tích hình ảnh và văn bản của AI trong việc phát hiện sản phẩm vi phạm."
        badge={
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
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
            <p className="text-3xl font-bold text-amber-600 tabular-nums">
              {needsReview}
            </p>
            <p className="text-xs text-muted-foreground">
              Sản phẩm có độ tin cậy AI trung bình cần người thật xác minh
            </p>
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline pt-1"
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
                    className="flex items-center justify-between text-xs p-2 rounded-lg bg-muted/40"
                  >
                    <span className="text-muted-foreground font-medium uppercase">
                      {s._id}
                    </span>
                    <span className="font-bold text-foreground tabular-nums">
                      {s.count}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Chưa có dữ liệu phân loại</p>
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
                      className={`flex items-center justify-between text-xs p-2 rounded-lg ${
                        isApproved
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                          : "bg-rose-50 text-rose-800 border border-rose-100"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-semibold">
                        {isApproved ? (
                          <IconCheck className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <IconX className="w-3.5 h-3.5 text-rose-600" />
                        )}
                        <span>{isApproved ? "AI Đề xuất duyệt" : "AI Cảnh báo vi phạm"}</span>
                      </div>
                      <span className="font-bold tabular-nums">{s.count}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Chưa có kết quả AI</p>
            )}
          </div>
        </StatCard>
      </div>

      {/* Action banner */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-foreground">
            Cần xem xét và thẩm định các sản phẩm đang chờ?
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Chuyển tới bảng kiểm duyệt sản phẩm để xem ảnh chi tiết, phân tích AI và quyết định duyệt hoặc từ chối.
          </p>
        </div>
        <Link
          href="/admin/products"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all shadow-2xs shrink-0"
        >
          Đi tới Kiểm duyệt sản phẩm
          <IconArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

