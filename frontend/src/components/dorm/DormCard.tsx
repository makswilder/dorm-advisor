import Link from "next/link";
import { Star } from "lucide-react";
import type { DormDto, DormSummaryDto } from "@/lib/types";

type Props = {
  dorm: DormDto | DormSummaryDto;
  schoolSlug?: string;
  avgOverall?: number;
  reviewCount?: number;
};

export function DormCard({ dorm, schoolSlug, avgOverall, reviewCount }: Props) {
  const slug = "dormSlug" in dorm ? dorm.dormSlug : dorm.slug;
  const name = "dormName" in dorm ? dorm.dormName : dorm.name;
  const sSlug = schoolSlug ?? ("schoolSlug" in dorm ? dorm.schoolSlug : "");
  const avg = avgOverall ?? ("avgOverall" in dorm ? dorm.avgOverall : undefined);
  const cnt = reviewCount ?? ("reviewCount" in dorm ? dorm.reviewCount : undefined);

  return (
    <Link
      href={`/reviews/${sSlug}/${slug}`}
      className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-blue-200 transition-all group"
    >
      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 truncate">
        {name}
      </h3>
      {"schoolName" in dorm && (
        <p className="text-xs text-gray-400 mb-2">{dorm.schoolName}</p>
      )}
      <div className="flex items-center gap-2">
        {avg !== undefined && avg > 0 ? (
          <>
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="font-bold text-gray-800">{avg.toFixed(1)}</span>
            {cnt !== undefined && (
              <span className="text-gray-400 text-xs">({cnt.toLocaleString()} reviews)</span>
            )}
          </>
        ) : (
          <span className="text-gray-400 text-xs">No reviews yet</span>
        )}
      </div>
    </Link>
  );
}
