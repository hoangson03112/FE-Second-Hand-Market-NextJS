"use client";

import type { IProduct } from "@/types/product";

type AIModerationSectionProps = {
  ai: NonNullable<IProduct["aiModerationResult"]>;
  estimatedWeight?: IProduct["estimatedWeight"];
};

export function AIModerationSection({ ai, estimatedWeight }: AIModerationSectionProps) {
  const isApproved = ai.approved === true;
  const isRejected = ai.approved === false;

  return (
    <section className="rounded-[2px] border border-luxury-ink/10 bg-cream-50/70 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-2xs font-bold text-luxury-ink uppercase tracking-[0.14em]">
          AI Kiểm duyệt tự động
        </h3>
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] border text-2xs font-bold uppercase tracking-wider ${
            ai.bypassAI
              ? "bg-taupe-50 border-luxury-ink/10 text-neutral-500"
              : isApproved
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : isRejected
                  ? "bg-blush-50 border-blush-200 text-blush-700"
                  : "bg-cream-50 border-luxury-ink/10 text-luxury-ink"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-[1px] ${
              ai.bypassAI
                ? "bg-neutral-400"
                : isApproved
                  ? "bg-emerald-600"
                  : isRejected
                    ? "bg-blush-600"
                    : "bg-amber-500"
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
        <p className="text-xs text-luxury-ink bg-white border border-luxury-ink/10 px-3 py-1.5 rounded-[2px]">
          👤 Yêu cầu kiểm duyệt thủ công bởi Admin
        </p>
      )}

      {(ai.reasons?.length ?? 0) > 0 && (
        <ul className="space-y-1 bg-white/70 p-2.5 rounded-[2px] border border-luxury-ink/6">
          {ai.reasons!.map((r, i) => (
            <li key={i} className="text-xs text-neutral-600 flex gap-2">
              <span className="mt-1.5 w-1 h-1 rounded-[1px] bg-neutral-400 shrink-0" />
              {r}
            </li>
          ))}
        </ul>
      )}

      {ai.rejectionReason && (
        <p className="text-xs text-blush-700 bg-blush-50/60 p-2 rounded-[2px] border border-blush-200">
          Lý do từ chối: {ai.rejectionReason}
        </p>
      )}

      {estimatedWeight && (
        <p className="text-xs text-neutral-500 pt-1">
          Cân nặng ước tính:{" "}
          <strong className="text-luxury-ink font-mono">{estimatedWeight.value}g</strong>{" "}
          ({Math.round(estimatedWeight.confidence * 100)}% độ tin cậy)
        </p>
      )}
    </section>
  );
}
