"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPendingReviews, approveReview, rejectReview } from "@/lib/api";
import { RatingStars } from "@/components/ui/RatingStars";
import { Spinner } from "@/components/ui/Spinner";
import { CheckCircle, XCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function AdminReviewsPage() {
  const qc = useQueryClient();
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["admin", "reviews"],
    queryFn: () => getPendingReviews().then((r) => r.data),
  });

  async function handleApprove(id: string) {
    await approveReview(id, {});
    qc.invalidateQueries({ queryKey: ["admin", "reviews"] });
  }

  async function handleReject(id: string) {
    await rejectReview(id, { reason: rejectReason || undefined });
    setRejectId(null);
    setRejectReason("");
    qc.invalidateQueries({ queryKey: ["admin", "reviews"] });
  }

  if (isLoading) return <div className="flex justify-center py-10"><Spinner className="w-6 h-6 text-blue-400" /></div>;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Pending Reviews ({reviews?.length ?? 0})</h2>
      {!reviews?.length && <p className="text-gray-400 text-sm">No pending reviews.</p>}
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
                  {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleApprove(review.id)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => setRejectId(review.id)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>
            {rejectId === review.id && (
              <div className="mt-3 flex gap-2">
                <input
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Reason (optional)"
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                />
                <button
                  onClick={() => handleReject(review.id)}
                  className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setRejectId(null)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
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
