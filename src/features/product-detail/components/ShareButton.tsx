"use client";

import { useState } from "react";
import {
  IconShare,
  IconBrandFacebook,
  IconBrandTelegram,
  IconBrandTwitter,
  IconLink,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import {
  shareFacebook,
  shareZalo,
  shareTelegram,
  shareTwitter,
  copyLink,
  nativeShare,
  isNativeShareSupported,
  type ShareData,
} from "@/utils/share";

interface ShareButtonProps {
  shareData: ShareData;
  className?: string;
}

export default function ShareButton({
  shareData,
  className = "",
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const success = await copyLink(shareData.url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    const success = await nativeShare(shareData);
    if (success) {
      setIsOpen(false);
    }
  };

  const shareOptions = [
    {
      name: "Facebook",
      icon: IconBrandFacebook,
      color: "text-[#1877F2]",
      bgColor: "hover:bg-[#1877F2]/10",
      action: () => shareFacebook(shareData),
    },
    {
      name: "Zalo",
      icon: IconLink, // Zalo icon placeholder
      color: "text-[#0068FF]",
      bgColor: "hover:bg-[#0068FF]/10",
      action: () => shareZalo(shareData),
      customIcon: (
        <svg className="w-5 h-5" viewBox="0 0 48 48" fill="currentColor">
          <path d="M24 4C13 4 4 13 4 24C4 35 13 44 24 44C35 44 44 35 44 24C44 13 35 4 24 4ZM32.2 30.8C31.9 31.3 31.3 31.6 30.7 31.6H17.3C16.7 31.6 16.1 31.3 15.8 30.8C15.5 30.3 15.5 29.6 15.8 29.1L22.5 18.4C22.8 17.9 23.4 17.6 24 17.6C24.6 17.6 25.2 17.9 25.5 18.4L32.2 29.1C32.5 29.6 32.5 30.3 32.2 30.8Z" />
        </svg>
      ),
    },
    {
      name: "Telegram",
      icon: IconBrandTelegram,
      color: "text-[#0088cc]",
      bgColor: "hover:bg-[#0088cc]/10",
      action: () => shareTelegram(shareData),
    },
    {
      name: "Twitter",
      icon: IconBrandTwitter,
      color: "text-[#1DA1F2]",
      bgColor: "hover:bg-[#1DA1F2]/10",
      action: () => shareTwitter(shareData),
    },
    {
      name: copied ? "Đã copy!" : "Copy link",
      icon: copied ? IconCheck : IconLink,
      color: copied ? "text-accent" : "text-neutral-500",
      bgColor: copied ? "hover:bg-taupe-100" : "hover:bg-cream-100",
      action: handleCopyLink,
    },
  ];

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-[2px] border border-luxury-ink/15 bg-white hover:bg-cream-50 hover:border-luxury-ink/30 transition-colors text-sm font-medium text-luxury-ink"
        aria-label="Chia sẻ"
      >
        <IconShare className="w-4 h-4" />
        <span className="hidden sm:inline">Chia sẻ</span>
      </button>

      {isOpen && (
        <>

          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />


          <div className="absolute right-0 mt-2 w-64 bg-white rounded-[2px] shadow-[0_16px_40px_rgba(26,23,20,0.12)] border border-luxury-ink/10 z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-luxury-ink/10 bg-cream-50/70 flex items-center justify-between">
              <h3 className="text-2xs font-bold uppercase tracking-[0.15em] text-luxury-ink">
                Chia sẻ sản phẩm
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-[2px] hover:bg-luxury-ink/5 transition-colors text-neutral-500 hover:text-luxury-ink"
                aria-label="Đóng"
              >
                <IconX className="w-4 h-4" />
              </button>
            </div>

            <div className="p-2">

              {isNativeShareSupported() && (
                <button
                  onClick={handleNativeShare}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[2px] hover:bg-primary/10 transition-colors text-left mb-1"
                >
                  <div className="w-8 h-8 rounded-[2px] border border-luxury-ink/10 bg-cream-50 flex items-center justify-center">
                    <IconShare className="w-4 h-4 text-luxury-ink" />
                  </div>
                  <span className="text-sm font-medium text-luxury-ink">
                    Chia sẻ...
                  </span>
                </button>
              )}


              {shareOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={() => {
                    option.action();
                    if (option.name !== "Copy link") {
                      setIsOpen(false);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[2px] ${option.bgColor} transition-colors text-left`}
                >
                  <div
                    className={`w-8 h-8 rounded-[2px] border border-luxury-ink/10 bg-cream-50 flex items-center justify-center ${option.color}`}
                  >
                    {option.customIcon || <option.icon className="w-5 h-5" />}
                  </div>
                  <span className="text-sm font-medium text-luxury-ink">
                    {option.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
