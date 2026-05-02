"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllReviews, removeReview } from "@/lib/api";
import { RatingStars } from "@/components/ui/RatingStars";
import { Spinner } from "@/components/ui/Spinner";
import { Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function AdminReviewsPage() {
  const qc = useQueryClient();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["admin", "reviews", "all"],
    queryFn: () => getAllReviews().then((r) => r.data),
  });

  async function handleRemove(id: string) {
    await removeReview(id);
    setConfirmId(null);
    qc.invalidateQueries({ queryKey: ["admin", "reviews", "all"] });
  }

  if (isLoading) return <div className="flex justify-center py-10"><Spinner className="w-6 h-6 text-blue-400" /></div>;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Live Reviews <span className="text-gray-400 font-normal text-base">({reviews?.length ?? 0})</span>
      </h2>
      {!reviews?.length && <p className="text-gray-400 text-sm">No reviews yet.</p>}
      <div className="space-y-3">
        {reviews?.map((review) => (
          <div key={review.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <RatingStars value={review.overall} size="sm" />
                  <span className="font-bold text-sm">{review.overall}/5</span>
                  <span className="text-xs text-gray-400 capitalize">{review.authorType.toLowerCase()}</span>
                  {review.isVerifiedAtPost && (
                    <span className="text-xs bg-blue-50 text-blue-600 rounded-full px-2 py-0.5">Verified</span>
                  )}
                </div>
                {review.reviewText && (
                  <p className="text-sm text-gray-600 line-clamp-2">{review.reviewText}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {review.authorEmail
                    ? <span className="text-blue-500">{review.authorEmail}</span>
                    : <span>Guest</span>}{" · "}
                  {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                </p>
              </div>
              <button
                onClick={() => setConfirmId(review.id)}
                className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors shrink-0"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            </div>

            {confirmId === review.id && (
              <div className="mt-3 flex items-center gap-2 bg-red-50 rounded-lg p-3">
                <p className="text-sm text-red-700 flex-1">Remove this review? It will be hidden immediately.</p>
                <button
                  onClick={() => handleRemove(review.id)}
                  className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setConfirmId(null)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-white"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
