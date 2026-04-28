import { getSchoolBySlug, getDormRankings } from "@/lib/api";
import { DormRankCard } from "@/components/dorm/DormRankCard";
import Link from "next/link";
import type { DormCategory } from "@/lib/types";
import { Trophy, MapPin } from "lucide-react";

const TABS: { value: DormCategory | "ALL"; label: string }[] = [
  { value: "ALL", label: "Overall" },
  { value: "FRESHMAN", label: "Freshman" },
  { value: "SOPHOMORE", label: "Sophomore" },
  { value: "JUNIOR", label: "Junior" },
  { value: "SENIOR", label: "Senior" },
];

interface Props {
  params: Promise<{ schoolSlug: string }>;
  searchParams: Promise<{ category?: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { schoolSlug } = await params;
  return {
    title: `Dorms Ranked at ${schoolSlug.replace(/-/g, " ")} — DormAdvisor`,
  };
}

export default async function RankingsPage({ params, searchParams }: Props) {
  const { schoolSlug } = await params;
  const { category } = await searchParams;
  const activeCategory = (category as DormCategory) ?? null;

  let school, rankings;
  try {
    const schoolRes = await getSchoolBySlug(schoolSlug);
    school = schoolRes.data;
    const rankRes = await getDormRankings(school.id, 1, activeCategory ?? undefined);
    rankings = rankRes.data;
  } catch {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center text-gray-500">
        School not found.{" "}
        <Link href="/all-schools" className="text-blue-600 hover:underline">← All Schools</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <Link href={`/dorms/${schoolSlug}`} className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-4">
        ← {school.name} dorms
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <Trophy className="w-7 h-7 text-yellow-400" />
        <h1 className="text-3xl font-black text-gray-900">Dorms Ranked at {school.name}</h1>
      </div>
      {(school.city || school.state) && (
        <div className="flex items-center gap-1 text-gray-400 text-sm mb-6">
          <MapPin className="w-4 h-4" />
          {[school.city, school.state].filter(Boolean).join(", ")}
        </div>
      )}

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap mb-8">
        {TABS.map((tab) => {
          const href =
            tab.value === "ALL"
              ? `/dorms-ranked/${schoolSlug}`
              : `/dorms-ranked/${schoolSlug}?category=${tab.value}`;
          const isActive = (activeCategory ?? "ALL") === tab.value;
          return (
            <Link
              key={tab.value}
              href={href}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                isActive
                  ? "text-gray-900"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
              style={isActive ? { backgroundColor: "#facc15" } : {}}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {rankings.length === 0 ? (
        <p className="text-gray-400 text-center py-12">
          No dorms with enough reviews to rank yet.
        </p>
      ) : (
        <div className="space-y-3">
          {rankings.map((r, i) => (
            <DormRankCard key={r.dormId} ranking={r} rank={i + 1} schoolSlug={schoolSlug} />
          ))}
        </div>
      )}
    </div>
  );
}
