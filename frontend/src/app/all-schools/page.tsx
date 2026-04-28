import { getAllSchools } from "@/lib/api";
import { SchoolCard } from "@/components/school/SchoolCard";
import Link from "next/link";
import type { SchoolDto } from "@/lib/types";
import { Plus } from "lucide-react";

export const metadata = {
  title: "All Schools — DormAdvisor",
  description: "Browse all colleges and universities on DormAdvisor.",
};

export default async function AllSchoolsPage() {
  let schools: SchoolDto[] = [];
  try {
    const res = await getAllSchools();
    schools = res.data.filter((s) => s.status === "ACTIVE");
  } catch {
    schools = [];
  }

  // Group by state
  const byState: Record<string, SchoolDto[]> = {};
  for (const school of schools) {
    const key = school.state ?? "Other";
    if (!byState[key]) byState[key] = [];
    byState[key].push(school);
  }
  const states = Object.keys(byState).sort();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">All Schools</h1>
          <p className="text-gray-500 mt-1">{schools.length} schools</p>
        </div>
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add School
        </Link>
      </div>

      {states.length === 0 && (
        <div className="text-center py-16 text-gray-400">No schools found. Be the first to add one!</div>
      )}

      <div className="space-y-10">
        {states.map((state) => (
          <section key={state}>
            <h2 className="text-lg font-bold text-gray-700 border-b border-gray-100 pb-2 mb-4">
              {state}{" "}
              <span className="text-gray-400 font-normal text-sm">
                ({byState[state].length})
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {byState[state].map((school) => (
                <SchoolCard key={school.id} school={school} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
