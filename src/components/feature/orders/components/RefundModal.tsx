import { IconCircleX } from "@tabler/icons-react";

interface Props {
  show: boolean;
  refundReason: string;
  isSubmitting: boolean;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export function RefundModal({ show, refundReason, isSubmitting, onChange, onSubmit, onClose }: Props) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-cream-50 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b-2 border-neutral-200/60">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-neutral-900">Yêu cầu hoàn tiền</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <IconCircleX className="w-6 h-6 text-neutral-500" />
            </button>
          </div>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Lý do hoàn tiền <span className="text-red-500">*</span>
            </label>
            <textarea
              value={refundReason}
              onChange={(e) => onChange(e.target.value)}
              rows={6}
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200/60 bg-cream-50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-neutral-900"
              placeholder="Vui lòng mô tả chi tiết lý do bạn muốn hoàn tiền..."
            />
            <p className="text-xs text-neutral-500 mt-2">
              * Yêu cầu hoàn tiền sẽ được xem xét trong vòng 24-48h
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-6 border-2 border-neutral-300 text-neutral-900 rounded-full font-bold hover:bg-neutral-50 transition-all"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !refundReason.trim()}
              className="flex-1 py-3 px-6 bg-orange-500 text-white rounded-full font-bold hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
