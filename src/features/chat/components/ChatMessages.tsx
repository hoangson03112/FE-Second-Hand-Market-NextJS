import { IconLoader2, IconMessage2 } from "@tabler/icons-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Message } from "@/types/chat";
import ProductMessageCard from "./ProductMessageCard";
import {
  parseProductMessage,
  type ParsedProductMessage,
} from "../utils/productMessage";

interface ChatMessagesProps {
  loading: boolean;
  messages: Message[];
  accountId: string;
}

/** Own bubbles are the ink panel; incoming ones stay on the white sheet. */
function bubbleClass(isOwn: boolean) {
  return cn(
    "max-w-[80%] rounded-[2px] px-4 py-3",
    isOwn
      ? "bg-luxury-ink text-luxury-ivory"
      : "border border-luxury-ink/10 bg-white text-luxury-ink",
  );
}

function MessageTimestamp({
  isOwn,
  createdAt,
}: {
  isOwn: boolean;
  createdAt: string;
}) {
  return (
    <span
      className={cn(
        "mt-2 block text-[9px] font-semibold uppercase tracking-[0.18em] tabular-nums",
        isOwn ? "text-right text-luxury-ivory/45" : "text-neutral-400",
      )}
    >
      {new Date(createdAt).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </span>
  );
}

function renderProductBubble(
  productInfo: ParsedProductMessage,
  message: Message,
  isOwn: boolean,
) {
  return (
    <div className="max-w-[85%]">
      <ProductMessageCard
        productId={productInfo.productId!}
        productName={productInfo.productName!}
        productPrice={productInfo.productPrice!}
        productSlug={productInfo.productSlug}
        productImage={productInfo.productImage}
      />
      <MessageTimestamp isOwn={isOwn} createdAt={message.createdAt} />
    </div>
  );
}

function renderTextBubble(message: Message, isOwn: boolean) {
  return (
    <div className={bubbleClass(isOwn)}>
      <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
        {message.text}
      </p>
      <MessageTimestamp isOwn={isOwn} createdAt={message.createdAt} />
    </div>
  );
}

function renderMediaBubble(message: Message, isOwn: boolean) {
  const mediaItems = message.media || [];

  return (
    <div className={cn(bubbleClass(isOwn), "space-y-2 px-3")}>
      {mediaItems.map((item, index) => {
        if (item.type === "video") {
          return (
            <video
              key={`${message._id}-video-${index}`}
              src={item.url}
              controls
              className="max-h-64 w-full rounded-[2px]"
            />
          );
        }

        return (
          <Image
            key={`${message._id}-image-${index}`}
            src={item.url}
            alt={item.name || "chat-media"}
            width={400}
            height={256}
            unoptimized
            className="max-h-64 w-full rounded-[2px] object-cover"
          />
        );
      })}

      {message.text ? (
        <p className="px-1 text-sm leading-relaxed break-words whitespace-pre-wrap">
          {message.text}
        </p>
      ) : null}

      <MessageTimestamp isOwn={isOwn} createdAt={message.createdAt} />
    </div>
  );
}

export function ChatMessages({
  loading,
  messages,
  accountId,
}: ChatMessagesProps) {
  if (loading) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <IconLoader2 className="h-4 w-4 animate-spin text-luxury-ink/40" />
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
          Đang tải tin nhắn
        </p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-10 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-[2px] border border-luxury-ink/10 bg-white">
          <IconMessage2 className="h-5 w-5 text-luxury-ink" strokeWidth={1.5} />
        </span>
        <p className="mt-5 max-w-xs text-sm leading-relaxed text-neutral-600">
          Chưa có tin nhắn nào. Gửi lời chào để bắt đầu cuộc trò chuyện.
        </p>
      </div>
    );
  }

  return (
    <>
      {messages.map((message) => {
        const isOwn = message.senderId === accountId;
        const productInfo = message.text
          ? parseProductMessage(message.text)
          : { isProductMessage: false };

        return (
          <div
            key={message._id}
            className={cn(
              "flex duration-500 animate-in fade-in slide-in-from-bottom-1",
              isOwn ? "justify-end" : "justify-start",
            )}
          >
            {productInfo.isProductMessage
              ? renderProductBubble(productInfo, message, isOwn)
              : message.type === "image" || message.type === "video"
                ? renderMediaBubble(message, isOwn)
                : renderTextBubble(message, isOwn)}
          </div>
        );
      })}
    </>
  );
}
