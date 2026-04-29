import Link from "next/link";
import { Star } from "lucide-react";
import { colorFromName } from "@/lib/colorFromName";
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
  const { from, to } = colorFromName(name);

  return (
    <Link
      href={`/reviews/${sSlug}/${slug}`}
      className="block relative rounded-xl overflow-hidden h-48 w-full hover:shadow-lg transition-shadow group/card"
    >
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/10 transition-colors" />

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="font-bold text-white text-sm leading-tight line-clamp-1 mb-0.5">
          {name}
        </h3>
        {"schoolName" in dorm && (
          <p className="text-white/60 text-xs mb-1.5">{dorm.schoolName}</p>
        )}
        <div className="flex items-center gap-1.5">
          {avg !== undefined && avg > 0 ? (
            <>
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-white font-bold text-sm">{avg.toFixed(1)}</span>
              {cnt !== undefined && (
                <span className="text-white/60 text-xs">({cnt.toLocaleString()} reviews)</span>
              )}
            </>
          ) : (
            <span className="text-white/60 text-xs">No reviews yet</span>
          )}
        </div>
      </div>
    </Link>
  );
}
