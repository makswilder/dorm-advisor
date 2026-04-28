"use client";

import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { uploadPhoto } from "@/lib/api";

interface Props {
  dormId: string;
  onSuccess: () => void;
  onClose: () => void;
}

export function PhotoUpload({ dormId, onSuccess, onClose }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      await uploadPhoto(dormId, file, caption || undefined);
      onSuccess();
    } catch {
      setError("Upload failed. Ensure the file is JPEG, PNG, or WebP under 10 MB.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-900">Add a Photo</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {preview ? (
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => { setFile(null); setPreview(null); }}
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="w-full aspect-video rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 hover:border-blue-400 hover:bg-blue-50 transition-colors text-gray-400"
            >
              <Upload className="w-8 h-8" />
              <span className="text-sm">Click to select a photo</span>
              <span className="text-xs">JPEG, PNG, WebP · max 10 MB</span>
            </button>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Caption (optional)"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={!file || loading}
            className="w-full py-3 rounded-xl font-semibold text-gray-900 transition-colors disabled:opacity-50"
            style={{ backgroundColor: "#facc15" }}
          >
            {loading ? "Uploading…" : "Upload Photo"}
          </button>
          <p className="text-xs text-gray-400 text-center">Photos are reviewed before going live.</p>
        </form>
      </div>
    </div>
  );
}
