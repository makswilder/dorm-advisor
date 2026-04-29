"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { createSchool, createDorm } from "@/lib/api";

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function AddSchoolPage() {
  const router = useRouter();
  const [schoolName, setSchoolName] = useState("");
  const [dormName, setDormName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const schoolRes = await createSchool({
        name: schoolName.trim(),
        slug: toSlug(schoolName),
        city: "",
        state: "",
        country: "US",
      });
      const dormRes = await createDorm(schoolRes.data.id, {
        name: dormName.trim(),
        slug: toSlug(dormName),
        categories: [],
      });
      router.push(`/reviews/${schoolRes.data.slug}/${dormRes.data.slug}`);
    } catch {
      setError("Could not add school. It may already exist — try searching first.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mb-8"
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </Link>

      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Add a school</h1>
      <p className="text-gray-500 mb-8">
        Enter the name of your school and the dorm you want to review. Make sure your school is not
        already in our{" "}
        <Link href="/all-schools" className="text-blue-600 hover:underline">
          directory
        </Link>
        .
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            School name <span className="text-red-500">*</span>
          </label>
          <input
            required
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            placeholder="e.g. University of Michigan"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dorm name <span className="text-red-500">*</span>
          </label>
          <input
            required
            value={dormName}
            onChange={(e) => setDormName(e.target.value)}
            placeholder="e.g. East Quad"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-400 mt-1">
            You&apos;ll write your review after adding the dorm.
          </p>
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting || !schoolName.trim() || !dormName.trim()}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting ? "Creating…" : "Add School & Dorm →"}
        </button>
      </form>
    </div>
  );
}
