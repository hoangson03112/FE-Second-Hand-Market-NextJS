"use client";

import { Bot, Loader2, Activity, Shield } from "lucide-react";
import { useAdminModeration } from "./hooks/useAdminModeration";

export default function AdminModeration() {
  const { statusStats, aiStats, needsReview, isLoading, error } =
    useAdminModeration();

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
        Không tải được thống kê kiểm duyệt.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-bold text-foreground">Kiểm duyệt AI</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Thống kê và cài đặt kiểm duyệt nội dung sản phẩm
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Activity className="h-4 w-4" />
            <span className="text-xs font-medium">Cần review thủ công</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{needsReview}</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Bot className="h-4 w-4" />
            <span className="text-xs font-medium">Theo trạng thái sản phẩm</span>
          </div>
          <ul className="mt-2 space-y-1 text-sm">
            {statusStats.map((s: { _id: string; count: number }) => (
              <li key={s._id}>
                <span className="text-muted-foreground">{s._id}:</span>{" "}
                <span className="font-medium text-foreground">{s.count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Shield className="h-4 w-4" />
            <span className="text-xs font-medium">Kết quả AI</span>
          </div>
          <ul className="mt-2 space-y-1 text-sm">
            {aiStats.map((s: { _id: boolean; count: number }) => (
              <li key={String(s._id)}>
                <span className="text-muted-foreground">
                  {s._id ? "Duyệt" : "Từ chối"}:
                </span>{" "}
                <span className="font-medium text-foreground">{s.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Duyệt hoặc từ chối sản phẩm cần xem xét tại mục{" "}
        <a href="/admin/products" className="text-primary underline">
          Sản phẩm
        </a>
        .
      </p>
    </div>
  );
}

