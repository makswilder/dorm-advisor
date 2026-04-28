"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { PhotoDto } from "@/lib/types";

interface Props {
  photos: PhotoDto[];
  apiBase: string;
}

export function PhotoGallery({ photos, apiBase }: Props) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  if (!photos.length) {
    return <p className="text-gray-400 text-sm py-6 text-center">No photos yet.</p>;
  }

  function prev() {
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx - 1 + photos.length) % photos.length);
  }
  function next() {
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx + 1) % photos.length);
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            onClick={() => setLightboxIdx(i)}
            className="aspect-video rounded-lg overflow-hidden bg-gray-100 hover:opacity-90 transition-opacity relative"
          >
            <Image
              src={`${apiBase}${photo.thumbUrl}`}
              alt={photo.caption ?? "Dorm photo"}
              fill
              className="object-cover"
              unoptimized
            />
          </button>
        ))}
      </div>

      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxIdx(null)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/40 rounded-full p-2 hover:bg-black/60"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="relative w-full max-w-3xl aspect-video mx-8" onClick={(e) => e.stopPropagation()}>
            <Image
              src={`${apiBase}${photos[lightboxIdx].url}`}
              alt={photos[lightboxIdx].caption ?? ""}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/40 rounded-full p-2 hover:bg-black/60"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <button
            onClick={() => setLightboxIdx(null)}
            className="absolute top-4 right-4 text-white bg-black/40 rounded-full p-2 hover:bg-black/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </>
  );
}
