"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getSchoolBySlug, getDormsBySchool, getDormRankings } from "@/lib/api";
import { DormCard } from "@/components/dorm/DormCard";
import { Spinner } from "@/components/ui/Spinner";
import type { DormDto, SchoolDto, DormCategory } from "@/lib/types";
import { MapPin, Plus, Trophy, ArrowRight } from "lucide-react";

const CATEGORIES: { value: DormCategory | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "FRESHMAN", label: "Freshman" },
  { value: "SOPHOMORE", label: "Sophomore" },
  { value: "JUNIOR", label: "Junior" },
  { value: "SENIOR", label: "Senior" },
];

export default function DormListPage() {
  const params = useParams();
  const schoolSlug = params.schoolSlug as string;

  const [school, setSchool] = useState<SchoolDto | null>(null);
  const [dorms, setDorms] = useState<DormDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<DormCategory | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<"name" | "reviews" | "rating">("name");

  useEffect(() => {
    async function load() {
      try {
        const schoolRes = await getSchoolBySlug(schoolSlug);
        setSchool(schoolRes.data);
        const dormsRes = await getDormsBySchool(schoolRes.data.id);
        setDorms(dormsRes.data.filter((d) => d.status === "ACTIVE"));
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [schoolSlug]);

  const filtered = dorms.filter((d) =>
    categoryFilter === "ALL" ? true : d.categories.includes(categoryFilter)
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Spinner className="w-8 h-8 text-blue-500" />
      </div>
    );
  }

  if (!school) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">School not found.</p>
        <Link href="/all-schools" className="text-blue-600 hover:underline mt-2 inline-block">← All Schools</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* School header */}
      <div className="mb-8">
        <Link href="/all-schools" className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-3">
          ← All Schools
        </Link>
        <h1 className="text-3xl font-black text-gray-900">{school.name}</h1>
        {(school.city || school.state) && (
          <div className="flex items-center gap-1 text-gray-400 text-sm mt-1">
            <MapPin className="w-4 h-4" />
            {[school.city, school.state].filter(Boolean).join(", ")}
          </div>
        )}
        <div className="flex gap-3 mt-4 flex-wrap">
          <Link
            href={`/dorms-ranked/${schoolSlug}`}
            className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Trophy className="w-4 h-4 text-yellow-400" />
            View Rankings
          </Link>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Dorm
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategoryFilter(cat.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                categoryFilter === cat.value
                  ? "text-gray-900"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
              style={categoryFilter === cat.value ? { backgroundColor: "#facc15" } : {}}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="ml-auto border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 bg-white focus:outline-none"
        >
          <option value="name">Sort: Name</option>
          <option value="reviews">Sort: Most Reviews</option>
          <option value="rating">Sort: Highest Rated</option>
        </select>
      </div>

      {/* Dorm grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          No dorms found. <Link href="/auth/login" className="text-blue-600 hover:underline">Add one?</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((dorm) => (
            <DormCard key={dorm.id} dorm={dorm} schoolSlug={schoolSlug} />
          ))}
        </div>
      )}
    </div>
  );
}
