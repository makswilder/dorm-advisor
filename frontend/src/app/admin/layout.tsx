"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@/components/ui/Spinner";
import { Shield, School, Building2, Star, MessageCircleQuestion } from "lucide-react";

const NAV = [
  { href: "/admin/schools", icon: School, label: "Schools" },
  { href: "/admin/dorms", icon: Building2, label: "Dorms" },
  { href: "/admin/reviews", icon: Star, label: "Reviews" },
  { href: "/admin/questions", icon: MessageCircleQuestion, label: "Q&A" },
];
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const isAdmin = user?.email === "maksim@pte.hu";

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      router.replace("/");
    }
  }, [user, isLoading, isAdmin, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Spinner className="w-8 h-8 text-blue-500" />
      </div>
    );
  }
  if (!user || !isAdmin) return null;
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="w-6 h-6 text-blue-500" />
        <h1 className="text-2xl font-black text-gray-900">Admin Panel</h1>
      </div>
      <div className="flex gap-6">
        <aside className="hidden sm:block w-48 shrink-0">
          <nav className="space-y-1">
            {NAV.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
