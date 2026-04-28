"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  getSchoolBySlug,
  getDormBySlug,
  getReviewsForDorm,
  getPhotosForDorm,
} from "@/lib/api";
import { ReviewCard } from "@/components/review/ReviewCard";
import { ReviewForm } from "@/components/review/ReviewForm";
import { PhotoGallery } from "@/components/photo/PhotoGallery";
import { PhotoUpload } from "@/components/photo/PhotoUpload";
import { QAWidget } from "@/components/qa/QAWidget";
import { ForumTeaser } from "@/components/forum/ForumTeaser";
import { RatingStars } from "@/components/ui/RatingStars";
import { Spinner } from "@/components/ui/Spinner";
import type { DormDto, PhotoDto, ReviewDto, SchoolDto } from "@/lib/types";
import { Camera, MessageSquare, Star, Trophy } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

type Tab = "reviews" | "photos" | "qa";

export default function DormDetailPage() {
  const params = useParams();
  const schoolSlug = params.schoolSlug as string;
  const dormSlug = params.dormSlug as string;

  const [school, setSchool] = useState<SchoolDto | null>(null);
  const [dorm, setDorm] = useState<DormDto | null>(null);
  const [reviews, setReviews] = useState<ReviewDto[]>([]);
  const [photos, setPhotos] = useState<PhotoDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("reviews");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);

  async function loadData() {
    try {
      const schoolRes = await getSchoolBySlug(schoolSlug);
      setSchool(schoolRes.data);
      const dormRes = await getDormBySlug(schoolRes.data.id, dormSlug);
      setDorm(dormRes.data);
      const [reviewsRes, photosRes] = await Promise.all([
        getReviewsForDorm(dormRes.data.id),
        getPhotosForDorm(dormRes.data.id),
      ]);
      setReviews(reviewsRes.data.filter((r) => r.status === "VISIBLE"));
      setPhotos(photosRes.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolSlug, dormSlug]);

  const avgOverall =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.overall, 0) / reviews.length
      : null;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Spinner className="w-8 h-8 text-blue-500" />
      </div>
    );
  }

  if (!dorm || !school) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center text-gray-500">
        Dorm not found.{" "}
        <Link href={`/dorms/${schoolSlug}`} className="text-blue-600 hover:underline">← Back</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-4 flex gap-2 items-center flex-wrap">
        <Link href="/all-schools" className="hover:text-blue-600">Schools</Link>
        <span>/</span>
        <Link href={`/dorms/${schoolSlug}`} className="hover:text-blue-600">{school.name}</Link>
        <span>/</span>
        <span className="text-gray-700">{dorm.name}</span>
      </nav>

      {/* Dorm header */}
      <div
        className="rounded-2xl p-8 text-white mb-8"
        style={{ background: "linear-gradient(135deg, #1a2744 0%, #2d3f6b 100%)" }}
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black mb-1">{dorm.name}</h1>
            <p className="text-blue-200 text-sm">{school.name}</p>
            {dorm.categories.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-2">
                {dorm.categories.map((cat) => (
                  <span
                    key={cat}
                    className="text-xs bg-white/20 text-white rounded-full px-2 py-0.5"
                  >
                    {cat.charAt(0) + cat.slice(1).toLowerCase()} Dorm
                  </span>
                ))}
              </div>
            )}
          </div>
          {avgOverall !== null && (
            <div className="text-center bg-white/10 rounded-xl px-6 py-4 shrink-0">
              <div className="text-4xl font-black">{avgOverall.toFixed(1)}</div>
              <RatingStars value={avgOverall} size="sm" />
              <p className="text-blue-200 text-xs mt-1">
                {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
              </p>
            </div>
          )}
        </div>
        <div className="flex gap-3 mt-6 flex-wrap">
          <button
            onClick={() => setShowReviewForm(true)}
            className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 font-bold px-5 py-2.5 rounded-full hover:bg-yellow-300 transition-colors text-sm"
          >
            <MessageSquare className="w-4 h-4" />
            Write a Review
          </button>
          <button
            onClick={() => setShowPhotoUpload(true)}
            className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-5 py-2.5 rounded-full hover:bg-white/10 transition-colors text-sm"
          >
            <Camera className="w-4 h-4" />
            Add Photo
          </button>
          <Link
            href={`/dorms-ranked/${schoolSlug}`}
            className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-5 py-2.5 rounded-full hover:bg-white/10 transition-colors text-sm"
          >
            <Trophy className="w-4 h-4" />
            See Rankings
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-8 w-fit">
        {(["reviews", "photos", "qa"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              activeTab === tab ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab === "qa" ? "Q&A" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === "reviews" && reviews.length > 0 && (
              <span className="ml-1.5 bg-gray-100 text-gray-600 text-xs rounded-full px-1.5 py-0.5">
                {reviews.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {activeTab === "reviews" && (
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <div className="text-center py-12">
                  <Star className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 mb-4">No reviews yet. Be the first!</p>
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 font-bold px-5 py-2.5 rounded-full hover:bg-yellow-300 transition-colors text-sm"
                  >
                    Write a Review
                  </button>
                </div>
              ) : (
                reviews.map((review) => <ReviewCard key={review.id} review={review} />)
              )}
            </div>
          )}
          {activeTab === "photos" && (
            <div>
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowPhotoUpload(true)}
                  className="inline-flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Camera className="w-4 h-4" />
                  Add Photo
                </button>
              </div>
              <PhotoGallery photos={photos} apiBase={API_BASE} />
            </div>
          )}
          {activeTab === "qa" && <QAWidget dormId={dorm.id} />}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Browse dorms on campus</h3>
            <Link
              href={`/dorms/${schoolSlug}`}
              className="text-blue-600 hover:underline text-sm flex items-center gap-1"
            >
              All dorms at {school.name} →
            </Link>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <ForumTeaser schoolId={school.id} schoolName={school.name} schoolSlug={schoolSlug} />
          </div>
        </div>
      </div>

      {showReviewForm && (
        <ReviewForm
          dormId={dorm.id}
          onSuccess={() => { setShowReviewForm(false); loadData(); }}
          onClose={() => setShowReviewForm(false)}
        />
      )}
      {showPhotoUpload && (
        <PhotoUpload
          dormId={dorm.id}
          onSuccess={() => { setShowPhotoUpload(false); loadData(); }}
          onClose={() => setShowPhotoUpload(false)}
        />
      )}
    </div>
  );
}
