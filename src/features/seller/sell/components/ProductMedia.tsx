"use client";

import { useRef } from "react";
import Image from "next/image";
import { IconUpload, IconVideo, IconMovie, IconTrash } from "@tabler/icons-react";

interface Props {
  existingImages: string[];
  newImages: File[];
  imageError?: string;
  onImagesChange: (files: File[]) => void;
  onRemoveExistingImage: (index: number) => void;
  existingVideoUrl: string | null;
  newVideo: File | null;
  onVideoChange: (file: File | null) => void;
  onRemoveExistingVideo: () => void;
}

export function ProductMedia({
  existingImages,
  newImages,
  imageError,
  onImagesChange,
  onRemoveExistingImage,
  existingVideoUrl,
  newVideo,
  onVideoChange,
  onRemoveExistingVideo,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const images = files.filter((f) => f.type.startsWith("image/")).slice(0, 10);
    onImagesChange(images);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files ?? []);
    const images = files.filter((f) => f.type.startsWith("image/"));
    if (images.length) onImagesChange([...newImages, ...images].slice(0, 10));
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file?.type.startsWith("video/")) onVideoChange(file);
    e.target.value = "";
  };

  const removeNewImage = (index: number) =>
    onImagesChange(newImages.filter((_, i) => i !== index));

  return (
    <div className="space-y-4 flex-1 min-h-0 flex flex-col">
      {/* ── Images ── */}
      <div className="flex-shrink-0">
        <p className="text-xs font-medium text-taupe-700 mb-2">
          Ảnh sản phẩm <span className="text-red-500">*</span>{" "}
          <span className="text-taupe-400 font-normal">(ít nhất 1, tối đa 10)</span>
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="rounded-xl border-2 border-dashed border-taupe-300 bg-taupe-50/60 px-4 py-4 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
        >
          <IconUpload className="w-7 h-7 mx-auto text-taupe-400 mb-1" />
          <p className="text-xs font-medium text-taupe-700">Chọn ảnh hoặc kéo thả ảnh vào đây</p>
        </div>

        {/* Existing images (edit mode) */}
        {existingImages.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-2">
            {existingImages.map((url, i) => (
              <div
                key={`existing-${i}`}
                className="relative aspect-square rounded-lg border border-border overflow-hidden bg-taupe-100 group"
              >
                <Image
                  src={url}
                  alt={`Ảnh ${i + 1}${i === 0 ? " (đại diện)" : ""}`}
                  fill
                  className="object-cover"
                />
                {i === 0 && newImages.length === 0 && (
                  <span className="absolute bottom-0.5 left-0.5 text-[9px] font-medium bg-primary text-primary-foreground px-1 py-0.5 rounded">
                    Đại diện
                  </span>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveExistingImage(i);
                  }}
                  className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                  aria-label="Xóa ảnh"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* New images */}
        {newImages.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-2">
            {newImages.map((file, i) => (
              <div
                key={`new-${i}`}
                className="relative aspect-square rounded-lg border border-border overflow-hidden bg-taupe-100 group"
              >
                <Image
                  src={URL.createObjectURL(file)}
                  alt={`Ảnh mới ${i + 1}${i === 0 && existingImages.length === 0 ? " (đại diện)" : ""}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
                {i === 0 && existingImages.length === 0 && (
                  <span className="absolute bottom-0.5 left-0.5 text-[9px] font-medium bg-primary text-primary-foreground px-1 py-0.5 rounded">
                    Đại diện
                  </span>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeNewImage(i);
                  }}
                  className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                  aria-label="Xóa ảnh"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {imageError && (
          <p className="mt-1 text-xs text-red-600">{imageError}</p>
        )}
      </div>

      {/* ── Video ── */}
      <div className="pt-2 border-t-2 border-border flex-shrink-0">
        <p className="text-xs font-medium text-taupe-700 mb-2 flex items-center gap-1.5">
          <IconMovie className="w-3.5 h-3.5" />
          Video{" "}
          <span className="text-taupe-400 font-normal">(tùy chọn, tối đa 50MB)</span>
        </p>

        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
          className="hidden"
        />

        {/* Existing video */}
        {existingVideoUrl && !newVideo && (
          <div className="relative rounded-xl border border-border bg-taupe-50/60 p-2 flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-lg bg-taupe-100 flex items-center justify-center shrink-0">
              <IconVideo className="w-5 h-5 text-taupe-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-taupe-900">Video hiện tại</p>
              <p className="text-[10px] text-taupe-500">Đã tải lên</p>
            </div>
            <button
              type="button"
              onClick={onRemoveExistingVideo}
              className="p-1.5 rounded-md text-taupe-400 hover:bg-red-50 hover:text-red-600 transition-colors"
              aria-label="Xóa video"
            >
              <IconTrash className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* New video preview */}
        {newVideo ? (
          <div className="relative rounded-xl border border-border bg-taupe-50/60 p-2 flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-taupe-100 flex items-center justify-center shrink-0">
              <IconVideo className="w-5 h-5 text-taupe-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-taupe-900 truncate">{newVideo.name}</p>
              <p className="text-[10px] text-taupe-500">
                {(newVideo.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              type="button"
              onClick={() => onVideoChange(null)}
              className="p-1.5 rounded-md text-taupe-400 hover:bg-red-50 hover:text-red-600 transition-colors"
              aria-label="Xóa video"
            >
              <IconTrash className="w-4 h-4" />
            </button>
          </div>
        ) : !existingVideoUrl ? (
          <button
            type="button"
            onClick={() => videoInputRef.current?.click()}
            className="w-full rounded-xl border-2 border-dashed border-taupe-300 bg-taupe-50/60 px-4 py-4 text-center hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center gap-1"
          >
            <IconVideo className="w-7 h-7 text-taupe-400" />
            <span className="text-xs font-medium text-taupe-700">Chọn video</span>
          </button>
        ) : null}

        {/* Replace video button */}
        {existingVideoUrl && !newVideo && (
          <button
            type="button"
            onClick={() => videoInputRef.current?.click()}
            className="w-full mt-2 rounded-xl border-2 border-dashed border-taupe-300 bg-taupe-50/60 px-4 py-2 text-center hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center gap-1"
          >
            <IconVideo className="w-5 h-5 text-taupe-400" />
            <span className="text-xs font-medium text-taupe-700">Thay thế video</span>
          </button>
        )}
      </div>
    </div>
  );
}