import { getHomepage } from "@/lib/api";
import { SchoolCard } from "@/components/school/SchoolCard";
import { DormCard } from "@/components/dorm/DormCard";
import { Carousel } from "@/components/ui/Carousel";
import { HeroSearch } from "@/components/home/HeroSearch";
import Link from "next/link";
import { CheckCircle, GraduationCap, MessageSquare, ArrowRight } from "lucide-react";

export default async function HomePage() {
  let data;
  try {
    const res = await getHomepage();
    data = res.data;
  } catch {
    data = { topSchools: [], topDormsByReviews: [], highestRatedDorms: [] };
  }

  const hasContent =
    data.topSchools.length > 0 ||
    data.topDormsByReviews.length > 0 ||
    data.highestRatedDorms.length > 0;

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Gradient background (replace with <Image fill> once hero-campus.jpg is in /public) */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-blue-900" />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 text-center px-4 py-24 w-full max-w-3xl mx-auto">
          {/* Verified badge */}
          <div className="inline-flex items-center gap-2 bg-white/15 text-white text-sm rounded-full px-4 py-1.5 mb-6 border border-white/25">
            <CheckCircle className="w-4 h-4 text-green-400" />
            Reviews from Verified Students
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-8 leading-tight">
            Real College Dorm Reviews
            <br />
            from Verified Students
          </h1>

          <HeroSearch />
        </div>
      </section>

      {/* ── Carousels ── */}
      {hasContent && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-14">
          {data.topSchools.length > 0 && (
            <Carousel title="Popular Schools" viewAllHref="/all-schools">
              {data.topSchools.map((school) => (
                <div key={school.id} className="shrink-0 w-52">
                  <SchoolCard school={school} />
                </div>
              ))}
            </Carousel>
          )}

          {data.topDormsByReviews.length > 0 && (
            <Carousel title="Popular Dorms">
              {data.topDormsByReviews.map((dorm) => (
                <div key={dorm.dormId} className="shrink-0 w-56">
                  <DormCard dorm={dorm} />
                </div>
              ))}
            </Carousel>
          )}

          {data.highestRatedDorms.length > 0 && (
            <Carousel title="Highest Rated Dorms">
              {data.highestRatedDorms.map((dorm) => (
                <div key={dorm.dormId} className="shrink-0 w-56">
                  <DormCard dorm={dorm} />
                </div>
              ))}
            </Carousel>
          )}
        </div>
      )}

      {/* ── Feature section 1: Find your school ── */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide mb-2 block">
              Discover
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Find your school</h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-6">
              We&apos;ve collected dorm reviews from hundreds of colleges and universities. Search for your
              school to get started.
            </p>
            <Link
              href="/all-schools"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse Schools
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Illustration placeholder */}
          <div className="bg-blue-50 rounded-2xl h-64 flex items-center justify-center">
            <GraduationCap className="w-28 h-28 text-blue-200" />
          </div>
        </div>
      </section>

      {/* ── Feature section 2: Write anonymous review ── */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Illustration placeholder (left on desktop) */}
          <div className="bg-indigo-50 rounded-2xl h-64 flex items-center justify-center order-last md:order-first">
            <MessageSquare className="w-28 h-28 text-indigo-200" />
          </div>

          <div>
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wide mb-2 block">
              Share
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              Write an anonymous review
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-6">
              Share your experience at your college dorm by writing a review. Your reviews are
              completely anonymous.
            </p>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Write a Review
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Empty state (no data yet) ── */}
      {!hasContent && (
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <GraduationCap className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">No dorms listed yet</h2>
          <p className="text-gray-400 mb-6">Be the first to add a school and write a review!</p>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
