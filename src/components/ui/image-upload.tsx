"use client";

import React, { useRef, useState } from "react";
import { Camera, Upload, Trash2, User, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/components/ui/toast-provider";

interface ImageUploadProps {
  currentImage?: string;
  name?: string;
  onImageChange: (dataUrl: string) => void;
  onImageRemove?: () => void;
  label?: string;
}

export function ImageUpload({
  currentImage,
  name,
  onImageChange,
  onImageRemove,
  label = "Profile Photo",
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const [dragActive, setDragActive] = useState(false);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid File", "Please select an image file (PNG, JPG, WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File Too Large", "Image size must be under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onImageChange(result);
        toast.success("Photo Uploaded", "Your profile image has been selected.");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleTriggerClick = () => {
    fileInputRef.current?.click();
  };

  const initials = name
    ?.split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <div className="space-y-3">
      <span className="block text-xs font-bold uppercase tracking-wider text-slate-700">
        {label}
      </span>

      <div className="flex flex-col sm:flex-row items-center gap-5">
        {/* Circle Preview Frame */}
        <div
          onClick={handleTriggerClick}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`group relative flex h-24 w-24 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed transition-all shadow-md ${
            dragActive
              ? "border-blue-500 bg-blue-50 scale-105"
              : currentImage
              ? "border-slate-300 bg-slate-100"
              : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50"
          }`}
        >
          {currentImage ? (
            <img
              src={currentImage}
              alt="Profile preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 group-hover:text-blue-600">
              {initials ? (
                <span className="text-2xl font-extrabold text-blue-600 font-sans">{initials}</span>
              ) : (
                <User className="h-9 w-9" />
              )}
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/60 text-white opacity-0 transition-opacity group-hover:opacity-100 backdrop-blur-[2px]">
            <Camera className="h-5 w-5" />
            <span className="mt-1 text-[10px] font-bold tracking-wider uppercase">Change</span>
          </div>
        </div>

        {/* Action Controls & Instructions */}
        <div className="space-y-2 text-center sm:text-left flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp, image/gif"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <button
              type="button"
              onClick={handleTriggerClick}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm hover:border-slate-400 hover:bg-slate-50 transition"
            >
              <Upload className="h-3.5 w-3.5 text-blue-600" />
              Upload Image
            </button>

            {currentImage && onImageRemove && (
              <button
                type="button"
                onClick={onImageRemove}
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            )}
          </div>

          <p className="text-[11px] text-slate-500">
            Supports PNG, JPG, or WEBP up to 5MB. Click or drag & drop.
          </p>
        </div>
      </div>
    </div>
  );
}
