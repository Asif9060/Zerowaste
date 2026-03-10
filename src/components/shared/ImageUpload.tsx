"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { X, Upload, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileState {
  id: string;
  status: "uploading" | "error";
  name: string;
  error?: string;
}

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
  folder?: string;
  label?: string;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  maxFiles = 1,
  folder = "zerowaste",
  label,
  className,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState<FileState[]>([]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const remaining = maxFiles - value.length;
      const filesToUpload = acceptedFiles.slice(0, remaining);
      if (!filesToUpload.length) return;

      const states: FileState[] = filesToUpload.map((f) => ({
        id: crypto.randomUUID(),
        status: "uploading" as const,
        name: f.name,
      }));
      setUploading((prev) => [...prev, ...states]);

      const results = await Promise.allSettled(
        filesToUpload.map(async (file, i) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("folder", folder);
          const res = await fetch("/api/upload", { method: "POST", body: formData });
          const json = await res.json();
          if (!res.ok) throw new Error(json.error ?? "Upload failed");
          setUploading((prev) => prev.filter((s) => s.id !== states[i].id));
          return json.url as string;
        })
      );

      const newUrls: string[] = [];
      results.forEach((result, i) => {
        if (result.status === "fulfilled") {
          newUrls.push(result.value);
        } else {
          const msg = result.reason instanceof Error ? result.reason.message : "Upload failed";
          setUploading((prev) =>
            prev.map((s) =>
              s.id === states[i].id ? { ...s, status: "error", error: msg } : s
            )
          );
        }
      });

      if (newUrls.length > 0) {
        onChange([...value, ...newUrls]);
      }
    },
    [value, onChange, maxFiles, folder]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    maxFiles: maxFiles - value.length,
    disabled: value.length >= maxFiles,
  });

  const removeImage = (url: string) => onChange(value.filter((u) => u !== url));
  const dismissError = (id: string) => setUploading((prev) => prev.filter((s) => s.id !== id));

  const canUploadMore = value.length < maxFiles;

  return (
    <div className={cn("space-y-3", className)}>
      {label && <p className="text-sm font-medium text-foreground">{label}</p>}

      {/* Previews + uploading placeholders */}
      {(value.length > 0 || uploading.length > 0) && (
        <div className="flex flex-wrap gap-3">
          {value.map((url) => (
            <div
              key={url}
              className="relative h-24 w-24 rounded-lg overflow-hidden border border-border bg-muted shrink-0"
            >
              <Image src={url} alt="Uploaded photo" fill className="object-cover" sizes="96px" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}

          {uploading.map((state) => (
            <div
              key={state.id}
              className={cn(
                "relative h-24 w-24 rounded-lg border flex flex-col items-center justify-center gap-1.5 px-2 text-center shrink-0",
                state.status === "error"
                  ? "border-destructive bg-destructive/10"
                  : "border-border bg-muted"
              )}
            >
              {state.status === "uploading" ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Uploading…</span>
                </>
              ) : (
                <>
                  <p className="text-xs text-destructive leading-tight line-clamp-2">{state.error}</p>
                  <button
                    type="button"
                    onClick={() => dismissError(state.id)}
                    className="text-xs text-destructive underline hover:no-underline"
                  >
                    Dismiss
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Dropzone — hidden once limit is reached */}
      {canUploadMore && (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors select-none",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/40"
          )}
        >
          <input {...getInputProps()} />
          <Upload className="h-6 w-6 text-muted-foreground" />
          <div className="text-center">
            <p className="text-sm font-medium">
              {isDragActive ? "Drop to upload" : "Drag & drop or click to browse"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              JPEG, PNG or WebP · Max 5 MB
              {maxFiles > 1 && ` · ${value.length} / ${maxFiles} uploaded`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
