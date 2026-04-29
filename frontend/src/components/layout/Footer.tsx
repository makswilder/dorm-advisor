import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 sm:grid-cols-4 gap-10">
        <div className="sm:col-span-2">
          <div className="font-extrabold text-xl tracking-tight mb-3">
            <span className="text-white">Dorm</span>
            <span className="text-blue-500">Advisor</span>
          </div>
          <p className="text-sm leading-relaxed max-w-xs">
            Honest dorm reviews by real college students. Find the best place to live on campus.
          </p>
        </div>

        <div>
          <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Browse</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/all-schools" className="hover:text-white transition-colors">
                All Schools
              </Link>
            </li>
            <li>
              <Link href="/auth/login" className="hover:text-white transition-colors">
                Sign In
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Help</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/help" className="hover:text-white transition-colors">
                FAQ
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between text-xs text-gray-600">
          <span>© {new Date().getFullYear()} DormAdvisor. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
