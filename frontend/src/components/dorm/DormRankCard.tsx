import Link from "next/link";
import { Star } from "lucide-react";
import type { DormRankingDto } from "@/lib/types";

interface Props {
  ranking: DormRankingDto;
  rank: number;
  schoolSlug: string;
}

export function DormRankCard({ ranking, rank, schoolSlug }: Props) {
  return (
    <Link
      href={`/reviews/${schoolSlug}/${ranking.dormSlug}`}
      className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-blue-200 transition-all flex gap-4"
    >
      <div className="text-3xl font-black text-gray-200 w-10 shrink-0 text-center leading-none mt-1">
        #{rank}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors truncate">
          {ranking.dormName}
        </h3>
        <div className="flex items-center gap-1.5 mt-1 mb-2">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="font-bold text-gray-800">{ranking.avgOverall.toFixed(1)}</span>
          <span className="text-gray-400 text-xs">({ranking.reviewCount} reviews)</span>
        </div>
        {ranking.reviewSnippet && (
          <p className="text-sm text-gray-500 line-clamp-2">&ldquo;{ranking.reviewSnippet}&rdquo;</p>
        )}
      </div>
    </Link>
  );
}
