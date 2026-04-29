"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { searchSchools } from "@/lib/api";
import type { SchoolDto } from "@/lib/types";

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SchoolDto[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      try {
        const res = await searchSchools(query);
        setResults(res.data.slice(0, 6));
        setShowDropdown(true);
      } catch {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(timeoutRef.current);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(school: SchoolDto) {
    setQuery("");
    setShowDropdown(false);
    router.push(`/dorms/${school.slug}`);
  }

  return (
    <div ref={wrapperRef} className="relative w-full max-w-lg mx-auto">
      <div className="flex items-center bg-white rounded-full px-5 py-3.5 shadow-xl gap-3">
        <Search className="w-5 h-5 text-gray-400 shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for your school..."
          className="flex-1 text-gray-900 placeholder-gray-400 text-base outline-none bg-transparent"
        />
      </div>

      {showDropdown && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-20">
          {results.map((school) => (
            <button
              key={school.id}
              onClick={() => handleSelect(school)}
              className="w-full text-left px-5 py-3.5 hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0"
            >
              <div className="font-medium text-gray-900 text-sm">{school.name}</div>
              {school.city && school.state && (
                <div className="text-gray-400 text-xs mt-0.5">
                  {school.city}, {school.state}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
