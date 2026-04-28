"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Search, GraduationCap, LogOut, User, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { searchSchools } from "@/lib/api";
import type { SchoolDto } from "@/lib/types";

export function NavBar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SchoolDto[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

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

  function handleSelect(school: SchoolDto) {
    setQuery("");
    setShowDropdown(false);
    router.push(`/dorms/${school.slug}`);
  }

  return (
    <header className="bg-navy-900 text-white shadow-md sticky top-0 z-50" style={{ backgroundColor: "#1a2744" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-16 gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 font-bold text-lg text-white hover:text-yellow-400 transition-colors">
          <GraduationCap className="w-6 h-6 text-yellow-400" />
          <span className="hidden sm:inline">DormAdvisor</span>
        </Link>

        {/* Search */}
        <div className="relative flex-1 max-w-lg">
          <div className="flex items-center bg-white/10 rounded-lg px-3 py-1.5 gap-2">
            <Search className="w-4 h-4 text-gray-300 shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find your school..."
              className="bg-transparent text-white placeholder-gray-400 text-sm flex-1 outline-none"
            />
          </div>
          {showDropdown && results.length > 0 && (
            <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-lg shadow-xl z-50 border border-gray-100 overflow-hidden">
              {results.map((school) => (
                <button
                  key={school.id}
                  onClick={() => handleSelect(school)}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 text-gray-800 text-sm border-b last:border-0"
                >
                  <div className="font-medium">{school.name}</div>
                  {school.city && school.state && (
                    <div className="text-gray-400 text-xs">{school.city}, {school.state}</div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/all-schools" className="text-gray-300 hover:text-white transition-colors">
            Schools
          </Link>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-xs">{user.email}</span>
              <Link href="/admin" className="text-yellow-400 hover:text-yellow-300 transition-colors">
                Admin
              </Link>
              <button onClick={logout} className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="flex items-center gap-1.5 bg-yellow-400 text-gray-900 px-4 py-1.5 rounded-full font-semibold hover:bg-yellow-300 transition-colors text-sm"
            >
              <User className="w-4 h-4" />
              Sign In
            </Link>
          )}
        </nav>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden ml-auto text-gray-300 hover:text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3 text-sm font-medium border-t border-white/10">
          <Link href="/all-schools" className="text-gray-300 py-2" onClick={() => setMobileOpen(false)}>Schools</Link>
          {user ? (
            <>
              <Link href="/admin" className="text-yellow-400 py-2" onClick={() => setMobileOpen(false)}>Admin</Link>
              <button onClick={() => { logout(); setMobileOpen(false); }} className="text-left text-gray-300 py-2">Sign Out</button>
            </>
          ) : (
            <Link href="/auth/login" className="text-yellow-400 py-2" onClick={() => setMobileOpen(false)}>Sign In</Link>
          )}
        </div>
      )}
    </header>
  );
}
