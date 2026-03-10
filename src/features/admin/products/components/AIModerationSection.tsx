"use client";

import type { IProduct } from "@/types/product";

type Props = {
  ai: NonNullable<IProduct["aiModerationResult"]>;
  estimatedWeight?: IProduct["estimatedWeight"];
};

export function AIModerationSection({ ai, estimatedWeight }: Props) {
  const isApproved = ai.approved === true;
  const isRejected = ai.approved === false;

  return (
    <section className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
          AI Kiểm duyệt
        </h3>
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
            ai.bypassAI
              ? "bg-muted text-muted-foreground"
              : isApproved
                ? "bg-secondary text-foreground/80"
                : isRejected
                  ? "bg-destructive/10 text-destructive"
                  : "bg-primary/10 text-primary/90"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              ai.bypassAI
                ? "bg-muted-foreground/40"
                : isApproved
                  ? "bg-primary/70"
                  : isRejected
                    ? "bg-destructive"
                    : "bg-primary/40"
            }`}
          />
          {ai.bypassAI
            ? "Bỏ qua AI"
            : isApproved
              ? `Duyệt (${Math.round((ai.confidence ?? 0) * 100)}%)`
              : isRejected
                ? "Từ chối"
                : "Đang xử lý"}
        </span>
      </div>

      {ai.humanReviewRequested && (
        <p className="text-xs text-foreground/70 bg-secondary/60 px-3 py-1.5 rounded-lg">
          👤 Yêu cầu kiểm duyệt thủ công
        </p>
      )}

      {(ai.reasons?.length ?? 0) > 0 && (
        <ul className="space-y-1">
          {ai.reasons!.map((r, i) => (
            <li key={i} className="text-xs text-muted-foreground flex gap-2">
              <span className="mt-1 w-1 h-1 rounded-full bg-muted-foreground shrink-0" />
              {r}
            </li>
          ))}
        </ul>
      )}

      {ai.rejectionReason && (
        <p className="text-xs text-destructive">
          Lý do từ chối: {ai.rejectionReason}
        </p>
      )}

      {estimatedWeight && (
        <p className="text-xs text-muted-foreground">
          Cân nặng ước tính: <strong className="text-foreground">{estimatedWeight.value}g</strong>{" "}
          ({Math.round(estimatedWeight.confidence * 100)}% tin cậy)
        </p>
      )}
    </section>
  );
}
