"use client";

import { useState } from "react";
import { X, Mail, ShieldCheck } from "lucide-react";
import { sendMagicLink } from "@/lib/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

interface SignInFormProps {
  onSuccess?: () => void;
}

export function SignInForm({ onSuccess }: SignInFormProps) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await sendMagicLink(email);
      setSent(true);
      onSuccess?.();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* .edu info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-800">
          Use a <strong>.edu</strong> address to earn a{" "}
          <span className="text-blue-600 font-semibold">Verified Student</span> badge on your reviews.
        </p>
      </div>

      {/* Google OAuth */}
      <div>
        <p className="text-sm font-semibold text-gray-800 mb-2">Continue with Google</p>
        <a
          href={`${API_BASE}/api/auth/oauth2/google`}
          className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-lg px-4 py-3 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {/* Google G logo SVG */}
          <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
            <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        </a>
      </div>

      {/* OR divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 border-t border-gray-200" />
        <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">or</span>
        <div className="flex-1 border-t border-gray-200" />
      </div>

      {/* Email section */}
      <div>
        <p className="text-sm font-semibold text-gray-800 mb-1">Email sign-in (any address)</p>
        <p className="text-xs text-gray-400 mb-3">
          No password setup required. We&apos;ll email you a one-time sign-in link.
        </p>

        {sent ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Check your inbox!</h3>
            <p className="text-sm text-gray-500">
              A sign-in link was sent to <strong>{email}</strong>. It expires in 15 minutes.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-400 text-white py-2.5 rounded-lg font-semibold hover:bg-gray-500 transition-colors disabled:opacity-60 text-sm"
            >
              {loading ? "Sending..." : "Send Email"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

interface SignInModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export function SignInModal({ onClose, onSuccess }: SignInModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Sign in to{" "}
          <span className="text-gray-900">Dorm</span>
          <span className="text-blue-600">Advisor</span>
        </h1>

        <SignInForm onSuccess={onSuccess} />
      </div>
    </div>
  );
}
