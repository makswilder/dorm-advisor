import Link from "next/link";
import { School, Building2, Star, MessageCircleQuestion, ArrowRight } from "lucide-react";

export default function AdminDashboard() {
  const sections = [
    { href: "/admin/schools", icon: School, label: "Pending Schools", color: "bg-blue-50 text-blue-600" },
    { href: "/admin/dorms", icon: Building2, label: "Pending Dorms", color: "bg-purple-50 text-purple-600" },
    { href: "/admin/reviews", icon: Star, label: "Pending Reviews", color: "bg-yellow-50 text-yellow-600" },
    { href: "/admin/questions", icon: MessageCircleQuestion, label: "Pending Q&A", color: "bg-green-50 text-green-600" },
  ];
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Moderation Queues</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map(({ href, icon: Icon, label, color }) => (
          <Link
            key={href}
            href={href}
            className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="font-medium text-gray-800">{label}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300" />
          </Link>
        ))}
      </div>
    </div>
  );
}
