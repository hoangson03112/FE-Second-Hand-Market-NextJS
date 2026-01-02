/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Inter } from "next/font/google";
import Image from "next/image";
import { MapPin, MessageCircle, Shield, Star, Award } from "lucide-react";
import { formatMonthYear } from "@/utils/format/date";
import { ISeller } from "@/types/product";

const inter = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-inter" });

interface SellerInfoProps {
  seller: ISeller;
  onChatClick?: () => void;
}

export default function SellerInfo({ seller, onChatClick }: SellerInfoProps) {
  return (
    <div className={`${inter.variable} font-sans space-y-6`}>
      {/* Seller Card */}
      <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-primary-dark flex items-center justify-center shadow-lg">
            <Award className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            Thông tin người bán
          </h3>
        </div>

        <div className="flex items-start gap-4 mb-6">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-gray-200 shadow-md">
            <Image
              src="https://res.cloudinary.com/dqvtj4uxo/image/upload/v1766999444/nyr9ca5yybq74hztndzk.jpg"
              alt={seller?.fullName || "Seller"}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-lg text-gray-900 mb-1">
              {seller?.fullName || "Người bán"}
            </h4>
            <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="font-medium">{seller?.province || "Chưa xác định"}</span>
            </div>
            {seller?.avgRating && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-4 h-4",
                        i < Math.floor(seller?.avgRating)
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {seller?.avgRating}/5
                </span>
                <span className="text-xs text-gray-500">
                  ({seller?.totalReviews || 0})
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-200 shadow-sm">
            <p className="text-2xl font-extrabold text-gray-900 mb-1">
              {seller?.totalReviews || 100}%
            </p>
            <p className="text-xs font-semibold text-gray-600">Phản hồi</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-200 shadow-sm">
            <p className="text-2xl font-extrabold text-gray-900 mb-1">
              {seller?.createdAt
                ? formatMonthYear(seller?.createdAt)
                : "N/A"}
            </p>
            <p className="text-xs font-semibold text-gray-600">Tham gia</p>
          </div>
        </div>

        <button
          onClick={onChatClick}
          className="cursor-pointer w-full group relative overflow-hidden flex justify-center items-center gap-2 py-4 px-6 bg-gradient-to-r from-green-500 via-green-600 to-green-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
        >
          <span className="relative z-10 flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Chat với người bán
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>

      {/* Safety Tips */}
      <div className="bg-yellow-50/80 backdrop-blur-sm border-2 border-yellow-200 rounded-3xl p-6 shadow-lg">
        <h4 className="font-bold text-yellow-900 mb-4 flex items-center gap-2 text-lg">
          <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
            <Shield className="w-5 h-5 text-yellow-700" />
          </div>
          Mẹo an toàn khi mua đồ cũ
        </h4>
        <ul className="space-y-3">
          {[
            "Gặp mặt tại nơi công cộng",
            "Kiểm tra hàng trước khi thanh toán",
            "Không chuyển khoản trước",
            "Báo cáo nếu có vấn đề",
          ].map((tip, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-sm text-gray-700 font-medium"
            >
              <div className="w-6 h-6 rounded-full bg-yellow-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-yellow-900 font-bold text-xs">{index + 1}</span>
              </div>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
