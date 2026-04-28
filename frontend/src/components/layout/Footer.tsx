import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
            <GraduationCap className="w-5 h-5 text-yellow-400" />
            DormAdvisor
          </div>
          <p className="text-sm leading-relaxed">
            Honest dorm reviews by real college students. Find the best place to live on campus.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Browse</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/all-schools" className="hover:text-white transition-colors">All Schools</Link></li>
            <li><Link href="/auth/login" className="hover:text-white transition-colors">Sign In</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Help</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/help" className="hover:text-white transition-colors">FAQ</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} DormAdvisor. All rights reserved.
      </div>
    </footer>
  );
}
