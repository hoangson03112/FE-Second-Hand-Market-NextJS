"use client";

import { IconLoader2, IconTruck, IconRefresh, IconExternalLink } from "@tabler/icons-react";
import { useOrderTracking } from "@/hooks/useOrderQueries";
import type { GHNTrackingEvent } from "@/types/order";
import { format } from "@/utils/format/date";

const GHN_TRACKING_URL = "https://tracking.ghn.dev/?order_code=";

interface OrderTrackingProps {
  orderId: string;
  ghnOrderCode?: string;
  className?: string;
}

const GHN_STATUS_LABEL: Record<string, string> = {
  ready_to_pick: "Chờ lấy hàng",
  picking: "Đang lấy hàng",
  cancel: "Đã hủy",
  money_collect_picking: "Đang thu tiền khi lấy",
  picked: "Đã lấy hàng",
  storing: "Đang lưu kho",
  transporting: "Đang vận chuyển",
  sorting: "Đang phân loại",
  delivering: "Đang giao hàng",
  money_collect_delivering: "Đang thu tiền khi giao",
  delivered: "Đã giao hàng",
  delivery_fail: "Giao thất bại",
  waiting_to_return: "Chờ hoàn hàng",
  return: "Đang hoàn hàng",
  return_transporting: "Đang vận chuyển hoàn",
  return_sorting: "Đang phân loại hoàn",
  returning: "Đang hoàn hàng",
  returned: "Đã hoàn hàng",
  exception: "Ngoại lệ",
  damage: "Hàng bị hỏng",
  lost: "Hàng bị mất",
};

export function OrderTracking({ orderId, ghnOrderCode, className = "" }: OrderTrackingProps) {
  const { data: tracking, isLoading, error, refetch } = useOrderTracking(
    orderId,
    Boolean(ghnOrderCode)
  );

  if (!ghnOrderCode) {
    return (
      <div className={`rounded-2xl bg-neutral-50 border border-neutral-200 p-4 text-center ${className}`}>
        <IconTruck className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
        <p className="text-sm text-neutral-500">Chưa có mã vận đơn GHN</p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-neutral-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 border-b border-neutral-200">
        <div className="flex items-center gap-2">
          <IconTruck className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-neutral-800">Theo dõi vận chuyển</span>
          {ghnOrderCode && (
            <span className="text-xs text-neutral-500 font-mono">#{ghnOrderCode}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {ghnOrderCode && (
            <a
              href={`${GHN_TRACKING_URL}${ghnOrderCode}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg hover:bg-neutral-200 transition-colors text-primary"
              title="Xem trên GHN"
            >
              <IconExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="p-1.5 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50"
            title="Làm mới"
          >
            <IconRefresh className={`w-3.5 h-3.5 text-neutral-500 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <IconLoader2 className="w-5 h-5 animate-spin text-primary" />
          </div>
        ) : error || !tracking ? (
          <p className="text-sm text-neutral-500 text-center py-4">
            Không thể tải thông tin vận chuyển
          </p>
        ) : (
          <>
            {/* Current status */}
            <div className="mb-4 p-3 rounded-xl bg-primary/5 border border-primary/20">
              <p className="text-xs text-primary/70 font-medium mb-1">Trạng thái hiện tại</p>
              <p className="text-sm font-bold text-primary">
                {GHN_STATUS_LABEL[tracking.status] ?? tracking.status_text ?? tracking.status}
              </p>
              {tracking.estimate_deliver_time && (
                <p className="text-xs text-neutral-500 mt-1">
                  Dự kiến giao:{" "}
                  <span className="font-medium text-neutral-700">
                    {format(tracking.estimate_deliver_time)}
                  </span>
                </p>
              )}
            </div>

            {/* Timeline log */}
            {tracking.log && tracking.log.length > 0 && (
              <ol className="space-y-3">
                {[...tracking.log].reverse().map((event: GHNTrackingEvent, idx) => (
                  <li key={idx} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-2.5 h-2.5 rounded-full shrink-0 mt-0.5 ${
                          idx === 0 ? "bg-primary" : "bg-neutral-300"
                        }`}
                      />
                      {idx < tracking.log!.length - 1 && (
                        <div className="w-0.5 flex-1 bg-neutral-200 mt-1" />
                      )}
                    </div>
                    <div className="pb-3 flex-1">
                      <p
                        className={`text-sm font-medium ${idx === 0 ? "text-neutral-900" : "text-neutral-600"}`}
                      >
                        {GHN_STATUS_LABEL[event.status] ?? event.status_text ?? event.status}
                      </p>
                      {event.note && (
                        <p className="text-xs text-neutral-500 mt-0.5">{event.note}</p>
                      )}
                      <p className="text-xs text-neutral-400 mt-0.5">{format(event.time)}</p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </>
        )}
      </div>
    </div>
  );
}
