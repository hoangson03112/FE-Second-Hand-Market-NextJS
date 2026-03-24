"use client";

import { useState } from "react";
import Image from "next/image";
import { IconLoader2, IconSparkles } from "@tabler/icons-react";
import { ChatService } from "@/services/chat.service";
import type { IProduct } from "@/types/product";
import { ChatInput } from "./ChatInput";

interface AIProductAssistantPanelProps {
  onBackToConversations: () => void;
}

interface AIMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  products?: IProduct[];
}

function getProductImage(product: IProduct): string {
  if (product.avatar?.url) return product.avatar.url;
  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images[0]?.url || "/images/product-placeholder.svg";
  }
  return "/images/product-placeholder.svg";
}

export function AIProductAssistantPanel({
  onBackToConversations,
}: AIProductAssistantPanelProps) {
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: "welcome-ai-message",
      sender: "ai",
      text: "Xin chào! Mình là trợ lý tìm sản phẩm. Bạn có thể mô tả nhu cầu như: 'Tìm điện thoại dưới 5 triệu' hoặc 'Có laptop gaming cũ không?'",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleAskAI = async (event: React.FormEvent) => {
    event.preventDefault();
    const question = value.trim();
    if (!question || loading) return;

    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: question,
    };

    setMessages((prev) => [...prev, userMessage]);
    setValue("");
    setLoading(true);

    try {
      const response = await ChatService.searchProductsByAI(question, 4);
      const products = Array.isArray(response?.data)
        ? (response.data as IProduct[])
        : [];

      const aiText =
        products.length > 0
          ? `Mình tìm thấy ${products.length} sản phẩm phù hợp. Bạn xem thử các gợi ý bên dưới nhé.`
          : "Mình chưa tìm thấy sản phẩm phù hợp. Bạn thử mô tả cụ thể hơn về tên, mức giá hoặc tình trạng sản phẩm.";

      const aiMessage: AIMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: aiText,
        products,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI product assistant error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-error-${Date.now()}`,
          sender: "ai",
          text: "Hiện tại mình chưa thể tìm kiếm sản phẩm. Bạn vui lòng thử lại sau vài giây.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-3 border-b border-border bg-primary/5">
        <button
          type="button"
          onClick={onBackToConversations}
          className="text-sm text-primary font-medium hover:underline"
        >
          ← Quay lại danh sách chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-cream-50/30 to-transparent">
        {messages.map((message) => {
          const isUser = message.sender === "user";
          return (
            <div
              key={message.id}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl px-5 py-3.5 shadow-sm ${
                  isUser
                    ? "bg-gradient-to-br from-primary to-primary/90 text-white rounded-br-md"
                    : "bg-white border border-border text-foreground rounded-bl-md"
                }`}
              >
                {!isUser && (
                  <div className="mb-2 flex items-center gap-2 text-primary">
                    <IconSparkles className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wide">
                      AI Assistant
                    </span>
                  </div>
                )}
                <p className="text-base leading-relaxed whitespace-pre-wrap">
                  {message.text}
                </p>

                {Array.isArray(message.products) && message.products.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {message.products.map((product) => (
                      <a
                        key={product._id}
                        href={`/products/${product._id}/${product.slug || "product"}`}
                        className="flex items-center gap-3 p-2 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-colors bg-background"
                      >
                        <Image
                          src={getProductImage(product)}
                          alt={product.name}
                          width={56}
                          height={56}
                          className="w-14 h-14 rounded-lg object-cover border border-border"
                          unoptimized
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {product.name}
                          </p>
                          <p className="text-sm text-primary font-medium">
                            {product.price.toLocaleString("vi-VN")}đ
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <IconLoader2 className="w-4 h-4 animate-spin" />
            <span>AI đang tìm sản phẩm...</span>
          </div>
        )}
      </div>

      <ChatInput
        value={value}
        sending={loading}
        selectedFiles={[]}
        placeholder="Mô tả sản phẩm bạn muốn tìm..."
        showAttachment={false}
        onChange={setValue}
        onFilesChange={() => {}}
        onRemoveFile={() => {}}
        onClearFiles={() => {}}
        onSubmit={handleAskAI}
      />
    </div>
  );
}
