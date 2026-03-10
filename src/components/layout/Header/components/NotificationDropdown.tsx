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
import { formatTimeAgo } from "@/utils/format/date";

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

  const getNotificationIcon = (type: string) => {
    if (type === "chat") return <IconMessageCircle className="w-4 h-4" />;
    if (type === "order") return <IconShoppingBag className="w-4 h-4" />;
    if (type === "product") return <IconPackage className="w-4 h-4" />;
    return <IconInfoCircle className="w-4 h-4" />;
  };

  const handleChatNotificationClick = (item: {
    title: string;
    metadata?: Record<string, unknown>;
  }) => {
    const senderId = item.metadata?.senderId;
    if (typeof senderId !== "string") return;

    const senderName =
      typeof item.metadata?.senderName === "string"
        ? item.metadata.senderName
        : item.title.replace(/^Tin nhắn mới từ\s+/i, "") || "Người dùng";
    const senderAvatar =
      typeof item.metadata?.senderAvatar === "string"
        ? item.metadata.senderAvatar
        : undefined;

    window.dispatchEvent(
      new CustomEvent("openChat", {
        detail: {
          userId: senderId,
          userName: senderName,
          userAvatar: senderAvatar,
        },
      }),
    );
    setIsOpen(false);
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
        className="flex relative items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-all duration-150 text-muted-foreground hover:text-foreground hover:bg-primary/10"
      >
        <IconBell className="w-[17px] h-[17px]" />
        {unreadCount > 0 && (
          <span
            className="absolute top-0 right-0 min-w-[16px] h-4 flex items-center justify-center text-white text-[9px] font-bold pointer-events-none"
            style={{
              background: "oklch(0.48 0.12 35)",
              borderRadius: "20px",
              border: "1.5px solid var(--background)",
              padding: "0 3px",
              boxShadow: "0 1px 4px oklch(0.48 0.12 35 / 0.4)",
            }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-[392px] max-h-[560px] rounded-xl border bg-card shadow-2xl flex flex-col z-[70] overflow-hidden"
          style={{ borderColor: "var(--border)", boxShadow: "0 18px 42px rgba(26,23,20,0.16)" }}
        >
          <div
            className="px-4 py-3 flex items-center justify-between"
            style={{ borderBottom: "1px solid var(--border)", background: "oklch(from var(--primary) l c h / 0.08)" }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-primary/15 text-primary"
              >
                <IconBell className="w-4 h-4" />
              </span>
              <div>
                <h2 className="text-sm font-semibold leading-none text-foreground" style={{ letterSpacing: "0.01em" }}>
                  Thông báo
                </h2>
                <p className="text-[11px] mt-1 text-muted-foreground">
                  {notifications.length} thông báo
                </p>
              </div>
            </div>

            <span
              className="text-[10px] font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary"
            >
              Mới nhất
            </span>
          </div>

          <div className="px-4 py-2 border-b border-border bg-card">
            <div className="flex items-center justify-between text-[10.5px] text-muted-foreground">
              <span>Xem nhanh {visibleNotifications.length} thông báo mới nhất</span>
            </div>
          </div>

          <div className="overflow-y-auto p-1.5">
            {visibleNotifications.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center px-6">
                <span
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-secondary text-muted-foreground"
                >
                  <IconBell className="w-6 h-6" />
                </span>
                <p className="font-semibold text-sm text-foreground">
                  Chưa có thông báo nào
                </p>
                <p className="text-xs mt-1.5 text-muted-foreground">
                  Khi có cập nhật mới, bạn sẽ thấy tại đây.
                </p>
              </div>
            ) : (
              visibleNotifications.map((item) => {
                const metadata = (item.metadata || {}) as Record<string, unknown>;
                const isChatShortcut =
                  item.type === "chat" && typeof metadata.senderId === "string";

                if (isChatShortcut) {
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        handleChatNotificationClick({
                          title: item.title,
                          metadata,
                        })
                      }
                      className="w-full text-left block rounded-lg p-3 transition-colors duration-200 group bg-card hover:bg-primary/10"
                    >
                      <div className="flex items-start justify-between gap-2.5">
                        <span
                          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary/15"
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
                      </div>
                    </button>
                  );
                }

                if (item.link) {
                  return (
                    <Link
                      key={item.id}
                      href={item.link}
                      onClick={() => setIsOpen(false)}
                      className="block rounded-lg p-3 transition-colors duration-200 group bg-card hover:bg-primary/10"
                    >
                      <div className="flex items-start gap-2.5">
                        <span
                          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary/15"
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
                      </div>
                    </Link>
                  );
                }

                return (
                  <div
                    key={item.id}
                    className="w-full text-left rounded-lg p-3 transition-colors duration-200 group bg-card hover:bg-primary/10"
                  >
                    <div className="flex items-start gap-2.5">
                      <span
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary/15"
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
                    </div>
                  </div>
                );
              })
            )}

            {hasMoreNotifications && (
              <div className="mx-2 mt-1 mb-2 rounded-lg px-3 py-2 text-center bg-primary/5">
                <p className="text-[11px] text-muted-foreground">
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
