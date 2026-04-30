"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { verifyToken } from "@/lib/api";
import { Suspense } from "react";

function VerifyInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      return;
    }
    verifyToken(token)
      .then(() => {
        // Cookie is set by the backend — nothing to store on the frontend
        setStatus("success");
        setTimeout(() => router.push("/"), 1500);
      })
      .catch(() => setStatus("error"));
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-sm w-full">
        {status === "loading" && (
          <>
            <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600">Verifying your link…</p>
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-1">You&apos;re signed in!</h2>
            <p className="text-gray-500 text-sm">Redirecting you home…</p>
          </>
        )}
        {status === "error" && (
          <>
            <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Link expired or invalid</h2>
            <p className="text-gray-500 text-sm mb-4">Magic links expire after 15 minutes and can only be used once.</p>
            <a href="/auth/login" className="text-blue-600 hover:underline text-sm font-medium">
              Request a new link →
            </a>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyInner />
    </Suspense>
  );
}
