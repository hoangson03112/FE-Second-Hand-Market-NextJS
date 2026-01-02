"use client";

import React, { useState } from "react";
import { Inter } from "next/font/google";
import { IProduct } from "@/types/product";
import { Info, FileText, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-inter" });

interface ProductTabsProps {
  product: IProduct;
}

export default function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  const attributesOfProduct = [
    {
      label: "Danh mục",
      value:
        typeof product.category === "object"
          ? product.category.name
          : product.category || "Chưa xác định",
    },
    {
      label: "Danh mục con",
      value:
        typeof product.subcategory === "object"
          ? product.subcategory.name
          : product.subcategory || "Chưa xác định",
    },
    ...(product.attributes?.map((att) => ({
      label: att.key,
      value: att.value,
    })) || []),
  ];

  return (
    <div className={`${inter.variable} font-sans bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden`}>
      {/* Tabs */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab(0)}
            className={cn(
              "relative px-8 py-5 font-medium text-base transition-all duration-200 flex items-center gap-2",
              activeTab === 0
                ? "text-gray-900"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            <FileText className="w-5 h-5" />
            Mô tả sản phẩm
            {activeTab === 0 && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary-dark rounded-t-full"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab(1)}
            className={cn(
              "relative px-8 py-5 font-medium text-base transition-all duration-200 flex items-center gap-2",
              activeTab === 1
                ? "text-gray-900"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            <Sparkles className="w-5 h-5" />
            Thông số kỹ thuật
            {activeTab === 1 && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary-dark rounded-t-full"></div>
            )}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-8">
        {activeTab === 0 && (
          <div className="space-y-6">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 whitespace-pre-line leading-relaxed text-base">
                {product.description || "Không có mô tả"}
              </p>
            </div>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 shadow-sm">
              <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-3 text-lg">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Info className="w-5 h-5 text-blue-700" />
                </div>
                Lưu ý khi mua đồ cũ:
              </h4>
              <ul className="space-y-3">
                {[
                  "Kiểm tra kỹ sản phẩm trước khi nhận",
                  "Thử nghiệm đầy đủ chức năng",
                  "Bảo hành theo chính sách của shop",
                ].map((note, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-sm text-gray-700 font-medium"
                  >
                    <div className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-900 font-bold text-xs">{index + 1}</span>
                    </div>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 1 && (
          <div>
            {attributesOfProduct.length > 0 ? (
              <div className="space-y-2">
                {attributesOfProduct.map((spec, index) => (
                  <div
                    key={index}
                    className="flex items-center py-4 px-5 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200"
                  >
                    <div className="w-1/2 font-bold text-gray-700 text-base">
                      {spec.label}
                    </div>
                    <div className="w-1/2 text-gray-600 font-semibold text-base">
                      {spec.value}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <FileText className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg font-medium">
                  Không có thông số kỹ thuật
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
