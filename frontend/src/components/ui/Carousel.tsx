"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps {
  title: string;
  viewAllHref?: string;
  children: React.ReactNode;
}

export function Carousel({ title, viewAllHref, children }: CarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -340 : 340, behavior: "smooth" });
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        {viewAllHref && (
          <Link href={viewAllHref} className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
            View all <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      <div className="relative group/carousel">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10
                     bg-white shadow-md rounded-full w-9 h-9 flex items-center justify-center
                     opacity-0 group-hover/carousel:opacity-100 transition-opacity border border-gray-100
                     hover:bg-gray-50"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2 no-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
        >
          {children}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10
                     bg-white shadow-md rounded-full w-9 h-9 flex items-center justify-center
                     opacity-0 group-hover/carousel:opacity-100 transition-opacity border border-gray-100
                     hover:bg-gray-50"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </section>
  );
}
