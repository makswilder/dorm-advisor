"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ImagePlus, Star, X } from "lucide-react";
import { createReview, uploadPhoto } from "@/lib/api";
import type { ReviewCreateDto } from "@/lib/types";

const schema = z.object({
  overall: z.number().min(1).max(5),
  cleanliness: z.number().min(1).max(5),
  locationRating: z.number().min(1).max(5),
  noise: z.number().min(1).max(5),
  value: z.number().min(1).max(5),
  social: z.number().min(1).max(5),
  roomQuality: z.number().min(1).max(5),
  bathroomRating: z.number().min(1).max(5),
  reviewText: z.string().min(20, "Review must be at least 20 characters"),
  classYear: z.number().optional().nullable(),
  yearLived: z.number().optional().nullable(),
});

type FormData = z.infer<typeof schema>;

const RATING_FIELDS: { key: keyof FormData; label: string }[] = [
  { key: "overall", label: "Overall" },
  { key: "cleanliness", label: "Cleanliness" },
  { key: "locationRating", label: "Location" },
  { key: "noise", label: "Noise Level" },
  { key: "value", label: "Value" },
  { key: "social", label: "Social Life" },
  { key: "roomQuality", label: "Room Quality" },
  { key: "bathroomRating", label: "Bathroom" },
];

interface Props {
  dormId: string;
  onSuccess: () => void;
  onClose: () => void;
  embedded?: boolean;
}

function StarRatingInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(i)}
          className="p-0.5"
        >
          <Star
            className={`w-6 h-6 transition-colors ${
              i <= (hovered || value)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-200 fill-gray-200"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export function ReviewForm({ dormId, onSuccess, onClose, embedded = false }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      overall: 0, cleanliness: 0, locationRating: 0, noise: 0,
      value: 0, social: 0, roomQuality: 0, bathroomRating: 0,
      reviewText: "",
    },
  });

  const values = watch();

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function removePhoto() {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function onSubmit(data: FormData) {
    setError("");
    setLoading(true);
    try {
      const { data: review } = await createReview(dormId, data as ReviewCreateDto);
      if (photoFile) {
        await uploadPhoto(dormId, photoFile, undefined, review.id);
      }
      onSuccess();
    } catch {
      setError("Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const formContent = (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        {RATING_FIELDS.map(({ key, label }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <StarRatingInput
              value={values[key] as number}
              onChange={(v) => setValue(key, v)}
            />
            {errors[key] && (
              <p className="text-red-500 text-xs mt-1">{errors[key]?.message}</p>
            )}
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your review <span className="text-gray-400 font-normal">(min. 20 chars)</span>
        </label>
        <textarea
          {...register("reviewText")}
          rows={4}
          placeholder="What was it like living there?"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        {errors.reviewText && (
          <p className="text-red-500 text-xs mt-1">{errors.reviewText.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Class year (optional)</label>
          <input
            type="number"
            {...register("classYear", { valueAsNumber: true })}
            placeholder="2025"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Year lived (optional)</label>
          <input
            type="number"
            {...register("yearLived", { valueAsNumber: true })}
            placeholder="2023"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Photo <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        {photoPreview ? (
          <div className="relative inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photoPreview} alt="Preview" className="h-32 w-auto rounded-lg object-cover border border-gray-200" />
            <button
              type="button"
              onClick={removePhoto}
              className="absolute -top-2 -right-2 bg-white rounded-full shadow p-0.5 text-gray-500 hover:text-red-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors"
          >
            <ImagePlus className="w-4 h-4" />
            Add a photo
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handlePhotoChange}
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-60"
      >
        {loading ? "Submitting…" : "Submit Review"}
      </button>
      <p className="text-xs text-gray-400 text-center">
        Reviews are reviewed by our team before going live.
      </p>
    </form>
  );

  if (embedded) return formContent;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white rounded-t-2xl">
          <h2 className="text-lg font-bold text-gray-900">Write a Review</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        {formContent}
      </div>
    </div>
  );
}
