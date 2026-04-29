"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { SignInModal } from "@/components/auth/SignInModal";
import { WriteReviewWizard } from "@/components/review/WriteReviewWizard";

export function NavBar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <>
      <header className="relative sticky top-0 z-40">
        {/* Background image + overlay */}
        <Image
          src="/Walpaper.jpg"
          alt=""
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/55" />

        {/* Nav row */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-16 gap-6">
          <Link href="/" className="font-extrabold text-xl tracking-tight shrink-0">
            <span className="text-white">Dorm</span>
            <span className="text-blue-300">Advisor</span>
          </Link>

          <nav className="hidden md:flex items-center gap-5 text-sm ml-auto">
            <Link
              href="/all-schools"
              className="text-white/80 hover:text-white font-medium transition-colors"
            >
              All Schools
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-white/50 text-xs truncate max-w-[140px]">{user.email}</span>
                <Link
                  href="/admin"
                  className="text-blue-300 hover:text-blue-100 font-medium transition-colors"
                >
                  Admin
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-white/70 hover:text-white transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowSignIn(true)}
                  className="text-white/80 hover:text-white font-medium transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setShowWizard(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-blue-400 transition-colors"
                >
                  Write a Review
                </button>
              </div>
            )}
          </nav>

          <button
            className="md:hidden ml-auto text-white/80 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="relative md:hidden px-4 pb-4 flex flex-col gap-1 border-t border-white/10 bg-black/70 backdrop-blur-sm">
            <Link
              href="/all-schools"
              className="py-3 text-white/80 font-medium text-sm border-b border-white/10"
              onClick={() => setMobileOpen(false)}
            >
              All Schools
            </Link>
            {user ? (
              <>
                <Link
                  href="/admin"
                  className="py-3 text-blue-300 font-medium text-sm border-b border-white/10"
                  onClick={() => setMobileOpen(false)}
                >
                  Admin
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="py-3 text-left text-white/70 text-sm"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setShowSignIn(true); setMobileOpen(false); }}
                  className="py-3 text-left text-white/80 font-medium text-sm border-b border-white/10"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setShowWizard(true); setMobileOpen(false); }}
                  className="mt-2 w-full bg-blue-500 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-400 transition-colors"
                >
                  Write a Review
                </button>
              </>
            )}
          </div>
        )}
      </header>

      {showSignIn && (
        <SignInModal
          onClose={() => setShowSignIn(false)}
          onSuccess={() => setShowSignIn(false)}
        />
      )}
      {showWizard && (
        <WriteReviewWizard onClose={() => setShowWizard(false)} />
      )}
    </>
  );
}
