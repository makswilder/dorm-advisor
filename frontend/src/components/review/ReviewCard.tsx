import { formatDistanceToNow } from "date-fns";
import { RatingStars } from "@/components/ui/RatingStars";
import { SubRatingBar } from "@/components/ui/SubRatingBar";
import { VerifiedBadge } from "@/components/ui/Badge";
import type { ReviewDto } from "@/lib/types";

interface Props {
  review: ReviewDto;
}

export function ReviewCard({ review }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <RatingStars value={review.overall} />
          <span className="font-bold text-gray-800 text-lg">{review.overall.toFixed(1)}</span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <VerifiedBadge verified={review.isVerifiedAtPost} />
          {review.authorType === "GUEST" && !review.isVerifiedAtPost && (
            <span className="text-xs text-gray-400">Guest</span>
          )}
          <span className="text-xs text-gray-400">
            {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>

      {review.reviewText && (
        <p className="text-gray-700 text-sm leading-relaxed mb-4">{review.reviewText}</p>
      )}

      <div className="space-y-1.5 mt-3">
        <SubRatingBar label="Cleanliness" value={review.cleanliness} />
        <SubRatingBar label="Location" value={review.locationRating} />
        <SubRatingBar label="Noise" value={review.noise} />
        <SubRatingBar label="Value" value={review.value} />
        <SubRatingBar label="Social Life" value={review.social} />
        <SubRatingBar label="Room Quality" value={review.roomQuality} />
        <SubRatingBar label="Bathroom" value={review.bathroomRating} />
      </div>

      {(review.classYear || review.yearLived) && (
        <div className="mt-3 flex gap-3 text-xs text-gray-400">
          {review.classYear && <span>Class of {review.classYear}</span>}
          {review.yearLived && <span>Lived there: {review.yearLived}</span>}
        </div>
      )}
    </div>
  );
}
