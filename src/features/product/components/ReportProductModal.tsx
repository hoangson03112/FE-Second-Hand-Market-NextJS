"use client";

import { IconX } from "@tabler/icons-react";
import { useState } from "react";
import { ReportService } from "@/services/report.service";
import { useToast } from "@/components/shared";
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
        error instanceof Error ? error.message : "Không thể gửi báo cáo"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-zinc-100">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900">Báo cáo sản phẩm</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors"
              aria-label="Đóng"
            >
              <IconX className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-zinc-500 mb-4">
            Đang báo cáo: <span className="font-semibold text-zinc-900">{productName}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                Lý do báo cáo
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả chi tiết vấn đề..."
                rows={4}
                className="w-full px-3.5 py-2.5 text-xs text-zinc-900 rounded-xl border border-zinc-200 bg-white placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
                required
              />
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-zinc-900 text-white rounded-xl text-xs font-semibold hover:bg-zinc-800 disabled:opacity-50 transition-colors"
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