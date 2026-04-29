"use client";

import Link from "next/link";
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
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-16 gap-6">
          {/* Two-tone logo */}
          <Link href="/" className="font-extrabold text-xl tracking-tight shrink-0">
            <span className="text-gray-900">Dorm</span>
            <span className="text-blue-600">Advisor</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-5 text-sm ml-auto">
            <Link
              href="/all-schools"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              All Schools
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-xs truncate max-w-[140px]">{user.email}</span>
                <Link
                  href="/admin"
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Admin
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-gray-500 hover:text-gray-800 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowSignIn(true)}
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setShowWizard(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors"
                >
                  Write a Review
                </button>
              </div>
            )}
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden ml-auto text-gray-600 hover:text-gray-900"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden px-4 pb-4 flex flex-col gap-1 border-t border-gray-100 bg-white">
            <Link
              href="/all-schools"
              className="py-3 text-gray-700 font-medium text-sm border-b border-gray-50"
              onClick={() => setMobileOpen(false)}
            >
              All Schools
            </Link>
            {user ? (
              <>
                <Link
                  href="/admin"
                  className="py-3 text-blue-600 font-medium text-sm border-b border-gray-50"
                  onClick={() => setMobileOpen(false)}
                >
                  Admin
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="py-3 text-left text-gray-600 text-sm"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setShowSignIn(true); setMobileOpen(false); }}
                  className="py-3 text-left text-gray-700 font-medium text-sm border-b border-gray-50"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setShowWizard(true); setMobileOpen(false); }}
                  className="mt-2 w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors"
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
