"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  IconBell,
  IconInfoCircle,
  IconMessageCircle,
  IconPackage,
  IconShoppingBag,
} from "@tabler/icons-react";
import Link from "next/link";
import { useNotificationStore } from "@/store/useNotificationStore";

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const diff = Date.now() - date.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return "Vừa xong";
  if (diff < hour) return `${Math.floor(diff / minute)} phút trước`;
  if (diff < day) return `${Math.floor(diff / hour)} giờ trước`;
  return `${Math.floor(diff / day)} ngày trước`;
}

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const notifications = useNotificationStore((state) => state.notifications);
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  const visibleNotifications = useMemo(
    () => notifications.slice(0, 20),
    [notifications],
  );
  const hasMoreNotifications = notifications.length > visibleNotifications.length;

  const unreadPreview = useMemo(
    () => visibleNotifications.filter((item) => !item.read).length,
    [visibleNotifications],
  );

  const getNotificationIcon = (type: string) => {
    if (type === "chat") return <IconMessageCircle className="w-4 h-4" />;
    if (type === "order") return <IconShoppingBag className="w-4 h-4" />;
    if (type === "product") return <IconPackage className="w-4 h-4" />;
    return <IconInfoCircle className="w-4 h-4" />;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen]);

  return (
    <div className="relative hidden xl:block" ref={dropdownRef}>
      <button
        type="button"
        aria-label="Thông báo"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex relative items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-all duration-150"
        style={{ color: "#7A6755" }}
        onMouseEnter={(event) => {
          event.currentTarget.style.color = "#C47B5A";
          event.currentTarget.style.background = "#EDE0D4";
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.color = "#7A6755";
          event.currentTarget.style.background = "";
        }}
      >
        <IconBell className="w-[17px] h-[17px]" />
        {unreadCount > 0 && (
          <span
            className="absolute top-0 right-0 min-w-[16px] h-4 flex items-center justify-center text-white text-[9px] font-bold"
            style={{
              background: "#C47B5A",
              borderRadius: "20px",
              border: "1.5px solid #FDFAF6",
              padding: "0 3px",
            }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-[392px] max-h-[560px] rounded-xl border bg-[#FFFCF8] shadow-2xl flex flex-col z-[70] overflow-hidden"
          style={{ borderColor: "#E4D9CC", boxShadow: "0 18px 42px rgba(26,23,20,0.16)" }}
        >
          <div
            className="px-4 py-3 flex items-center justify-between"
            style={{ borderBottom: "1px solid #EFE4D8", background: "#FFF7EE" }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "#F2E3D4", color: "#C47B5A" }}
              >
                <IconBell className="w-4 h-4" />
              </span>
              <div>
                <h2 className="text-sm font-semibold leading-none" style={{ color: "#1A1714", letterSpacing: "0.01em" }}>
                  Thông báo
                </h2>
                <p className="text-[11px] mt-1" style={{ color: "#A8957F" }}>
                  {notifications.length} tổng • {unreadCount} chưa đọc
                </p>
              </div>
            </div>

            <span
              className="text-[10px] font-semibold px-2 py-1 rounded-full"
              style={{ background: "#F5EDE4", color: "#8A7264" }}
            >
              Mới nhất
            </span>
          </div>

          <div className="px-4 py-2" style={{ borderBottom: "1px solid #F3E9DE", background: "#FFFCF8" }}>
            <div className="flex items-center justify-between text-[10.5px]" style={{ color: "#8A7264" }}>
              <span>Xem nhanh {visibleNotifications.length} thông báo mới nhất</span>
              <span>{unreadPreview} chưa đọc trong danh sách</span>
            </div>
          </div>

          <div className="overflow-y-auto p-1.5">
            {visibleNotifications.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center px-6">
                <span
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                  style={{ background: "#F5EDE4", color: "#B8997D" }}
                >
                  <IconBell className="w-6 h-6" />
                </span>
                <p className="font-semibold text-sm" style={{ color: "#4A3F33" }}>
                  Chưa có thông báo nào
                </p>
                <p className="text-xs mt-1.5" style={{ color: "#A8957F" }}>
                  Khi có cập nhật mới, bạn sẽ thấy tại đây.
                </p>
              </div>
            ) : (
              visibleNotifications.map((item) => {
                const cardClass = item.read ? "bg-[#FFFCF8]" : "bg-[#FFF3E7]";

                if (item.link) {
                  return (
                    <Link
                      key={item.id}
                      href={item.link}
                      onClick={() => setIsOpen(false)}
                      className={`block rounded-lg p-3 transition-colors hover:bg-[#FBECDD] ${cardClass}`}
                    >
                      <div className="flex items-start justify-between gap-2.5">
                        <span
                          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                          style={{ background: item.read ? "#F5EEE5" : "#FDE8D7", color: "#B06038" }}
                        >
                          {getNotificationIcon(item.type)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-sm text-foreground line-clamp-1">{item.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 break-words line-clamp-2 leading-relaxed">
                            {item.message}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-1.5 font-medium">
                            {formatTimeAgo(item.createdAt)}
                          </p>
                        </div>
                        {!item.read && (
                          <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                        )}
                      </div>
                    </Link>
                  );
                }

                return (
                  <div
                    key={item.id}
                    className={`w-full text-left rounded-lg p-3 transition-colors hover:bg-[#FBECDD] ${cardClass}`}
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <span
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: item.read ? "#F5EEE5" : "#FDE8D7", color: "#B06038" }}
                      >
                        {getNotificationIcon(item.type)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm text-foreground line-clamp-1">{item.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 break-words line-clamp-2 leading-relaxed">
                          {item.message}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-1.5 font-medium">
                          {formatTimeAgo(item.createdAt)}
                        </p>
                      </div>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {hasMoreNotifications && (
              <div className="mx-2 mt-1 mb-2 rounded-lg px-3 py-2 text-center" style={{ background: "#F7EFE7" }}>
                <p className="text-[11px]" style={{ color: "#8A7264" }}>
                  Đang hiển thị 20 thông báo mới nhất. Danh sách cuộn trong khung này.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
