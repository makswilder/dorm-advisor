import Link from "next/link";
import { MapPin, BookOpen } from "lucide-react";
import type { SchoolDto, SchoolSummaryDto } from "@/lib/types";

type Props = { school: SchoolDto | SchoolSummaryDto };

export function SchoolCard({ school }: Props) {
  const reviewCount = "totalReviews" in school ? school.totalReviews : null;
  return (
    <Link
      href={`/dorms/${school.slug}`}
      className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-blue-200 transition-all group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "#1a2744" }}>
          <BookOpen className="w-5 h-5 text-yellow-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
            {school.name}
          </h3>
          {(school.city || school.state) && (
            <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
              <MapPin className="w-3 h-3" />
              <span>{[school.city, school.state].filter(Boolean).join(", ")}</span>
            </div>
          )}
        </div>
      </div>
      {reviewCount !== null && (
        <p className="text-xs text-gray-400 mt-3">
          {reviewCount.toLocaleString()} {reviewCount === 1 ? "review" : "reviews"}
        </p>
      )}
    </Link>
  );
}
