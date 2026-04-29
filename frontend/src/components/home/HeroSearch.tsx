"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { getAllSchools } from "@/lib/api";
import type { SchoolDto } from "@/lib/types";

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [schools, setSchools] = useState<SchoolDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getAllSchools()
      .then((res) => setSchools(res.data.filter((s) => s.status === "ACTIVE")))
      .catch(() => setSchools([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  const filtered = query.trim()
    ? schools.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))
    : schools;

  return (
    <div ref={wrapperRef} className="w-full max-w-2xl mx-auto relative">
      {/* Input */}
      <div
        className={`bg-white shadow-2xl overflow-hidden transition-all ${
          open ? "rounded-t-2xl" : "rounded-2xl"
        }`}
      >
        <div className="flex items-center px-5 py-4">
          <Search className="w-4 h-4 text-gray-400 shrink-0 mr-3" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setOpen(true)}
            placeholder={
              loading
                ? "Loading schools…"
                : `Scroll to browse all ${schools.length} schools`
            }
            className="flex-1 text-gray-700 placeholder-gray-400 text-sm outline-none bg-transparent"
          />
        </div>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute w-full bg-white rounded-b-2xl shadow-2xl border-t border-gray-100 max-h-64 overflow-y-auto z-30">
          {filtered.map((school) => (
            <button
              key={school.id}
              onMouseDown={() => {
                setOpen(false);
                router.push(`/dorms/${school.slug}`);
              }}
              className="w-full text-left px-5 py-3 hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0 flex items-baseline gap-3"
            >
              <span className="font-semibold text-gray-900 text-sm">{school.name}</span>
              {school.city && (
                <span className="text-gray-400 text-xs shrink-0">{school.city}</span>
              )}
            </button>
          ))}
          {!loading && filtered.length === 0 && (
            <p className="px-5 py-4 text-sm text-gray-400 text-center">No schools found</p>
          )}
        </div>
      )}
    </div>
  );
}
