"use client";

import { useRouter } from "next/navigation";
import { SignInForm } from "@/components/auth/SignInModal";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-2xl font-extrabold mb-1">
            <span className="text-gray-900">Dorm</span>
            <span className="text-blue-600">Advisor</span>
          </div>
          <p className="text-gray-500 text-sm">Sign in to your account</p>
        </div>
        <SignInForm onSuccess={() => router.push("/")} />
      </div>
    </div>
  );
}
