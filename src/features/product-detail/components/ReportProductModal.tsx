"use client";

import { IconX } from "@tabler/icons-react";
import { useState } from "react";
import { ReportService } from "@/services/report.service";
import { useToast } from "@/components/ui";
import { PRODUCT_UI_MESSAGES } from "@/constants/messages";

interface ReportProductModalProps {
  productId: string;
  productName: string;
  onClose: () => void;
}

export default function ReportProductModal({
  productId,
  productName,
  onClose,
}: ReportProductModalProps) {
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error(PRODUCT_UI_MESSAGES.REPORT_REASON_REQUIRED);
      return;
    }
    setIsSubmitting(true);
    try {
      await ReportService.create({
        type: "product",
        targetId: productId,
        description: description.trim(),
      });
      toast.success(PRODUCT_UI_MESSAGES.REPORT_SUCCESS);
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể gửi báo cáo",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-luxury-ink/60 backdrop-blur-sm">
      <div className="bg-white border border-luxury-ink/10 rounded-[2px] shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-luxury-ink/8">
            <h2 className="font-droid-serif text-base font-bold text-luxury-ink">
              Báo Cáo Sản Phẩm Vi Phạm
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-[2px] text-neutral-400 hover:text-luxury-ink hover:bg-taupe-50 transition-colors"
              aria-label="Đóng"
            >
              <IconX className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-neutral-600 mb-4">
            Đang báo cáo:{" "}
            <span className="font-bold text-luxury-ink">{productName}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-2xs font-bold uppercase tracking-[0.14em] text-neutral-600 mb-1.5">
                Lý do báo cáo vi phạm *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả cụ thể hành vi vi phạm (hàng giả, lừa đảo, mô tả sai lệch, nội dung phản cảm...)"
                rows={4}
                className="w-full px-3.5 py-2.5 text-xs text-luxury-ink rounded-[2px] border border-luxury-ink/15 bg-white placeholder:text-neutral-400 focus:outline-none focus:border-luxury-ink transition-all resize-none"
                required
              />
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 border border-luxury-ink/15 rounded-[2px] text-2xs font-bold uppercase tracking-[0.12em] text-luxury-ink hover:bg-taupe-50 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-luxury-ink text-luxury-ivory rounded-[2px] text-2xs font-bold uppercase tracking-[0.12em] hover:bg-charcoal-800 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? "Đang gửi..." : "Gửi báo cáo"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
