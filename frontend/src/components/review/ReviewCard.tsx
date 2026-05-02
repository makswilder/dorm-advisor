import { formatDistanceToNow } from "date-fns";
import { RatingStars } from "@/components/ui/RatingStars";
import { SubRatingBar } from "@/components/ui/SubRatingBar";
import { AdminBadge, VerifiedBadge } from "@/components/ui/Badge";
import type { ReviewDto } from "@/lib/types";

interface Props {
  review: ReviewDto;
}

export function ReviewCard({ review }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          {review.authorEmoji ? (
            <span className="text-2xl leading-none">{review.authorEmoji}</span>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm font-semibold shrink-0">
              {review.authorType === "GUEST" ? "G" : "U"}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-800 text-sm">
                {review.authorName ?? (review.authorType === "GUEST" ? "Guest" : "Member")}
              </span>
              <AdminBadge isAdmin={review.isAdmin} />
              <VerifiedBadge verified={review.isVerifiedAtPost} />
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <RatingStars value={review.overall} />
              <span className="font-bold text-gray-800 text-base">{review.overall.toFixed(1)}</span>
            </div>
          </div>
        </div>
        <span className="text-xs text-gray-400 shrink-0">
          {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
        </span>
      </div>

      {review.reviewText && (
        <p className="text-gray-700 text-sm leading-relaxed mb-4 break-words">{review.reviewText}</p>
      )}

      {review.photos && review.photos.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {review.photos.map((photo) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={photo.id}
              src={photo.thumbUrl}
              alt={photo.caption ?? "Review photo"}
              className="h-28 w-auto rounded-lg object-cover border border-gray-100 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(photo.url, "_blank")}
            />
          ))}
        </div>
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
