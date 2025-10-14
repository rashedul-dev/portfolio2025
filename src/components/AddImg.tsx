"use client";

import { AlertCircleIcon, ImageIcon, UploadIcon, XIcon } from "lucide-react";
import { useFileUpload } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useRef } from "react";

interface AddImgProps {
  onImageSelect: (file: File | null) => void;
}

export default function AddImg({ onImageSelect }: AddImgProps) {
  const maxSizeMB = 2;
  const maxSize = maxSizeMB * 1024 * 1024; // 2MB default

  const [
    { files, isDragging, errors },
    { handleDragEnter, handleDragLeave, handleDragOver, handleDrop, openFileDialog, removeFile, getInputProps },
  ] = useFileUpload({
    accept: "image/svg+xml,image/png,image/jpeg,image/jpg,image/gif",
    maxSize,
  });

  const previewUrl = files[0]?.preview || null;
  const hasNotifiedRef = useRef(false);

  // Notify parent when file is selected or removed - FIXED INFINITE LOOP
  useEffect(() => {
    if (files[0] && files[0].file && !hasNotifiedRef.current) {
      const fileObj = files[0].file;
      if (fileObj && typeof fileObj === "object" && "size" in fileObj && "type" in fileObj) {
        hasNotifiedRef.current = true;
        onImageSelect(fileObj as File);
      }
    } else if (files.length === 0 && hasNotifiedRef.current) {
      hasNotifiedRef.current = false;
      onImageSelect(null);
    }
  }, [files, onImageSelect]);

  const handleRemoveFile = useCallback(
    (fileId: string) => {
      removeFile(fileId);
      hasNotifiedRef.current = false;
      onImageSelect(null);
    },
    [removeFile, onImageSelect]
  );

  // Prevent form submission when clicking the upload button
  const handleUploadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    hasNotifiedRef.current = false;
    openFileDialog();
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        {/* Drop area */}
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors has-[input:focus]:ring-[3px]"
        >
          <input {...getInputProps()} className="sr-only" aria-label="Upload image file" />
          {previewUrl ? (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <img
                src={previewUrl}
                alt={files[0]?.file?.name || "Uploaded image"}
                className="mx-auto max-h-full rounded object-contain"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
              <div
                className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                aria-hidden="true"
              >
                <ImageIcon className="size-4 opacity-60" />
              </div>
              <p className="mb-1.5 text-sm font-medium">Drop your image here</p>
              <p className="text-muted-foreground text-xs">SVG, PNG, JPG or GIF (max. {maxSizeMB}MB)</p>
              <Button variant="outline" className="mt-4" onClick={handleUploadClick} type="button">
                <UploadIcon className="-ms-1 size-4 opacity-60" aria-hidden="true" />
                Select image
              </Button>
            </div>
          )}
        </div>

        {previewUrl && (
          <div className="absolute top-4 right-4">
            <button
              type="button"
              className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleRemoveFile(files[0]?.id);
              }}
              aria-label="Remove image"
            >
              <XIcon className="size-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div className="text-destructive flex items-center gap-1 text-xs" role="alert">
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}

      <p aria-live="polite" role="region" className="text-muted-foreground mt-2 text-center text-xs">
        Single image uploader w/ max size (drop area + button)
      </p>
    </div>
  );
}
