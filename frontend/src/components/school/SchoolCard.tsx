import Link from "next/link";
import Image from "next/image";
import { colorFromName } from "@/lib/colorFromName";
import type { SchoolDto, SchoolSummaryDto } from "@/lib/types";

const SCHOOL_PHOTOS: Record<string, string> = {
  "corvinus":               "/corvinus.jpg",
  "elte":                   "/elte.jpg",
  "university-of-pecs":     "/pecs.jpg",
  "university-of-debrecen": "/debrecen.jpg",
};

type Props = { school: SchoolDto | SchoolSummaryDto };

export function SchoolCard({ school }: Props) {
  const reviewCount = "totalReviews" in school ? school.totalReviews : null;
  const photo = SCHOOL_PHOTOS[school.slug];
  const { from, to } = colorFromName(school.name);

  return (
    <Link
      href={`/dorms/${school.slug}`}
      className="block relative rounded-xl overflow-hidden h-44 w-full hover:shadow-lg transition-shadow group/card"
    >
      {photo ? (
        <Image
          src={photo}
          alt={school.name}
          fill
          className="object-cover object-center group-hover/card:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, 208px"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/10 transition-colors" />

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="font-bold text-white text-sm leading-tight line-clamp-2 mb-1.5">
          {school.name}
        </h3>
        {(school.city || school.state) && (
          <p className="text-white/60 text-xs mb-1.5">
            {[school.city, school.state].filter(Boolean).join(", ")}
          </p>
        )}
        {reviewCount !== null && (
          <span className="inline-block bg-white/20 text-white text-xs rounded-full px-2 py-0.5">
            {reviewCount.toLocaleString()} {reviewCount === 1 ? "review" : "reviews"}
          </span>
        )}
      </div>
    </Link>
  );
}
