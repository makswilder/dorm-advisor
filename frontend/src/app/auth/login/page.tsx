"use client";

import { useState } from "react";
import { GraduationCap, Mail, ArrowRight } from "lucide-react";
import { sendMagicLink } from "@/lib/api";

export default function LoginPage() {
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
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "#1a2744" }}>
            <GraduationCap className="w-7 h-7 text-yellow-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Sign in to DormAdvisor</h1>
          <p className="text-gray-500 text-sm mt-1 text-center">
            We&apos;ll email you a magic link — no password needed.
          </p>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Check your inbox!</h2>
            <p className="text-gray-500 text-sm">
              If that email is valid, a sign-in link has been sent to <strong>{email}</strong>.
              The link expires in 15 minutes.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                School or personal email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                Use your .edu email to get a Verified Student badge.
              </p>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-gray-900 transition-colors disabled:opacity-60"
              style={{ backgroundColor: "#facc15" }}
            >
              {loading ? "Sending..." : "Send Magic Link"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
