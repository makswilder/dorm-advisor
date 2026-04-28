import { getHomepage } from "@/lib/api";
import { SchoolCard } from "@/components/school/SchoolCard";
import { DormCard } from "@/components/dorm/DormCard";
import Link from "next/link";
import { Star, BookOpen, ArrowRight } from "lucide-react";

export default async function HomePage() {
  let data;
  try {
    const res = await getHomepage();
    data = res.data;
  } catch {
    data = { topSchools: [], topDormsByReviews: [], highestRatedDorms: [] };
  }

  return (
    <div>
      {/* Hero */}
      <section
        className="text-white py-24 px-4"
        style={{ background: "linear-gradient(135deg, #1a2744 0%, #2d3f6b 100%)" }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight">
            Find the <span className="text-yellow-400">best dorm</span> on campus
          </h1>
          <p className="text-lg text-blue-200 mb-8">
            Real reviews from real students. Rate your dorm. Help future students choose wisely.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/all-schools"
              className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 font-bold px-6 py-3 rounded-full hover:bg-yellow-300 transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              Browse Schools
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition-colors"
            >
              Write a Review
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16">
        {/* Popular Schools */}
        {data.topSchools.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Popular Schools</h2>
              <Link href="/all-schools" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.topSchools.map((school) => (
                <SchoolCard key={school.id} school={school} />
              ))}
            </div>
          </section>
        )}

        {/* Most Reviewed Dorms */}
        {data.topDormsByReviews.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Most Reviewed Dorms</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.topDormsByReviews.map((dorm) => (
                <DormCard key={dorm.dormId} dorm={dorm} />
              ))}
            </div>
          </section>
        )}

        {/* Highest Rated Dorms */}
        {data.highestRatedDorms.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              <h2 className="text-2xl font-bold text-gray-900">Highest Rated Dorms</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.highestRatedDorms.map((dorm) => (
                <DormCard key={dorm.dormId} dorm={dorm} />
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {!data.topSchools.length && !data.topDormsByReviews.length && (
          <div className="text-center py-16">
            <p className="text-gray-400 mb-4">No data yet — be the first to add a school and dorm!</p>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 font-bold px-5 py-2.5 rounded-full hover:bg-yellow-300 transition-colors"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
