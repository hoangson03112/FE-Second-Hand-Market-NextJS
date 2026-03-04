import { IconLoader2, IconSend } from "@tabler/icons-react";
import Image from "next/image";
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

function MessageTimestamp({
  isOwn,
  createdAt,
}: {
  isOwn: boolean;
  createdAt: string;
}) {
  return (
    <span
      className={`text-sm mt-1.5 block ${
        isOwn ? "text-white/70 text-right" : "text-muted-foreground"
      }`}
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
    <div
      className={`max-w-[80%] rounded-2xl px-5 py-3.5 shadow-sm ${
        isOwn
          ? "bg-gradient-to-br from-primary to-primary/90 text-white rounded-br-md"
          : "bg-white border border-border text-foreground rounded-bl-md"
      }`}
    >
      <p className="text-base leading-relaxed break-words whitespace-pre-wrap">
        {message.text}
      </p>
      <MessageTimestamp isOwn={isOwn} createdAt={message.createdAt} />
    </div>
  );
}

function renderMediaBubble(message: Message, isOwn: boolean) {
  const mediaItems = message.media || [];

  return (
    <div
      className={`max-w-[80%] rounded-2xl px-3 py-3 shadow-sm space-y-2 ${
        isOwn
          ? "bg-gradient-to-br from-primary to-primary/90 text-white rounded-br-md"
          : "bg-white border border-border text-foreground rounded-bl-md"
      }`}
    >
      {mediaItems.map((item, index) => {
        if (item.type === "video") {
          return (
            <video
              key={`${message._id}-video-${index}`}
              src={item.url}
              controls
              className="max-h-64 rounded-lg w-full"
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
            className="max-h-64 rounded-lg w-full object-cover"
          />
        );
      })}

      {message.text ? (
        <p className="text-base leading-relaxed break-words whitespace-pre-wrap px-1">
          {message.text}
        </p>
      ) : null}

      <MessageTimestamp isOwn={isOwn} createdAt={message.createdAt} />
    </div>
  );
}

export function ChatMessages({ loading, messages, accountId }: ChatMessagesProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <IconLoader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-base text-muted-foreground">Đang tải tin nhắn...</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-10">
        <div className="bg-primary/10 p-6 rounded-full mb-4">
          <IconSend className="w-14 h-14 text-primary" />
        </div>
        <p className="text-base text-muted-foreground max-w-sm">
          Bắt đầu cuộc trò chuyện bằng cách gửi tin nhắn đầu tiên
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
            className={`flex ${
              isOwn ? "justify-end" : "justify-start"
            } animate-in fade-in slide-in-from-bottom-2 duration-300`}
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
