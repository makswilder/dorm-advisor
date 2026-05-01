"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, Search } from "lucide-react";
import { getAllSchools, getDormsBySchool, createSchool, createDorm } from "@/lib/api";
import { SignInForm } from "@/components/auth/SignInModal";
import { ReviewForm } from "@/components/review/ReviewForm";
import { useAuth } from "@/hooks/useAuth";
import type { SchoolDto, DormDto } from "@/lib/types";

type Step = "auth" | "school" | "add-school" | "dorm" | "review";

const STEP_PROGRESS: Record<Step, number> = {
  auth: 20,
  school: 45,
  "add-school": 55,
  dorm: 70,
  review: 92,
};

const STEP_LABELS = ["Sign in", "School", "Dorm"];

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

interface Props {
  onClose: () => void;
}

export function WriteReviewWizard({ onClose }: Props) {
  const { isLoggedIn } = useAuth();
  const [step, setStep] = useState<Step>("auth");

  useEffect(() => {
    if (isLoggedIn) setStep((s) => (s === "auth" ? "school" : s));
  }, [isLoggedIn]);
  const [showSignIn, setShowSignIn] = useState(false);
  const [pendingAddSchool, setPendingAddSchool] = useState(false);

  const [selectedSchool, setSelectedSchool] = useState<SchoolDto | null>(null);
  const [selectedDorm, setSelectedDorm] = useState<DormDto | null>(null);

  const [schoolQuery, setSchoolQuery] = useState("");
  const [allSchools, setAllSchools] = useState<SchoolDto[]>([]);

  const [dorms, setDorms] = useState<DormDto[]>([]);
  const [dormQuery, setDormQuery] = useState("");
  const [dormsLoading, setDormsLoading] = useState(false);

  const [newSchoolName, setNewSchoolName] = useState("");
  const [newDormName, setNewDormName] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");

  useEffect(() => {
    getAllSchools()
      .then((res) => setAllSchools(res.data))
      .catch(() => setAllSchools([]));
  }, []);

  const schoolResults = schoolQuery.trim()
    ? allSchools.filter((s) =>
        s.name.toLowerCase().includes(schoolQuery.toLowerCase())
      ).slice(0, 8)
    : [];

  useEffect(() => {
    if (step !== "dorm" || !selectedSchool) return;
    setDormsLoading(true);
    getDormsBySchool(selectedSchool.id)
      .then((res) => setDorms(res.data.filter((d) => d.status === "ACTIVE")))
      .catch(() => setDorms([]))
      .finally(() => setDormsLoading(false));
  }, [step, selectedSchool]);

  async function handleAddSchool() {
    if (!newSchoolName.trim() || !newDormName.trim()) return;
    setAdding(true);
    setAddError("");
    try {
      const schoolRes = await createSchool({
        name: newSchoolName.trim(),
        slug: toSlug(newSchoolName),
        city: "",
        state: "",
        country: "US",
      });
      const dormRes = await createDorm(schoolRes.data.id, {
        name: newDormName.trim(),
        slug: toSlug(newDormName),
        categories: [],
      });
      setSelectedSchool(schoolRes.data);
      setSelectedDorm(dormRes.data);
      setStep("review");
    } catch {
      setAddError("Could not add school. It may already exist — try searching instead.");
    } finally {
      setAdding(false);
    }
  }

  function goToAddSchool() {
    if (isLoggedIn) {
      setStep("add-school");
    } else {
      setPendingAddSchool(true);
      setShowSignIn(true);
    }
  }

  function goBack() {
    if (step === "school") setStep("auth");
    else if (step === "add-school") setStep("school");
    else if (step === "dorm") setStep("school");
    else if (step === "review") setStep("dorm");
  }

  const filteredDorms = dorms.filter((d) =>
    d.name.toLowerCase().includes(dormQuery.toLowerCase())
  );

  const stepIndex =
    step === "auth" ? 0
    : step === "school" || step === "add-school" ? 1
    : step === "dorm" ? 2
    : 3;

  return (
    <>
      {/* Wizard overlay */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
            <h2 className="text-lg font-bold text-gray-900">Write a Review</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto flex-1 px-6 py-5">
            {/* Progress bar */}
            <div className="w-full bg-gray-100 h-1.5 rounded-full mb-3">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${STEP_PROGRESS[step]}%` }}
              />
            </div>

            {/* Step labels */}
            <div className="flex justify-between mb-6">
              {STEP_LABELS.map((label, i) => (
                <span
                  key={label}
                  className={`text-xs font-medium ${
                    i === stepIndex
                      ? "text-blue-600"
                      : i < stepIndex
                      ? "text-gray-400"
                      : "text-gray-300"
                  }`}
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Step: auth */}
            {step === "auth" && (
              <div className="space-y-4">
                <p className="text-gray-600 text-sm">
                  Sign in to get started, or continue as a guest. You can complete your review either way.
                </p>
                <button
                  onClick={() => setShowSignIn(true)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Continue with Email
                </button>
                <button
                  onClick={() => setStep("school")}
                  className="w-full border border-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Continue as Guest
                </button>
              </div>
            )}

            {/* Step: school */}
            {step === "school" && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 mb-2">Search for your school</h3>
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5 gap-2 focus-within:ring-2 focus-within:ring-blue-500 bg-white">
                  <Search className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    value={schoolQuery}
                    onChange={(e) => setSchoolQuery(e.target.value)}
                    placeholder="School name..."
                    className="flex-1 text-sm text-gray-900 outline-none placeholder-gray-400"
                    autoFocus
                  />
                </div>

                {schoolResults.length > 0 && (
                  <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                    {schoolResults.map((school) => (
                      <button
                        key={school.id}
                        onClick={() => {
                          setSelectedSchool(school);
                          setStep("dorm");
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0"
                      >
                        <div className="font-medium text-gray-900 text-sm">{school.name}</div>
                        {(school.city || school.state) && (
                          <div className="text-gray-400 text-xs mt-0.5">
                            {[school.city, school.state].filter(Boolean).join(", ")}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {schoolQuery.trim() && schoolResults.length === 0 && (
                  <p className="text-sm text-gray-500 px-1">
                    No schools found for &quot;{schoolQuery}&quot;.
                  </p>
                )}

                <p className="text-sm pt-2">
                  <span className="text-gray-500">Can&apos;t find your school? </span>
                  <button
                    onClick={goToAddSchool}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Add a new school
                  </button>
                </p>
              </div>
            )}

            {/* Step: add-school */}
            {step === "add-school" && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Add your school</h3>
                <p className="text-sm text-gray-500">
                  Enter the name of your school and the dorm you want to review.
                </p>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School name</label>
                  <input
                    value={newSchoolName}
                    onChange={(e) => setNewSchoolName(e.target.value)}
                    placeholder="e.g. University of Michigan"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dorm name</label>
                  <input
                    value={newDormName}
                    onChange={(e) => setNewDormName(e.target.value)}
                    placeholder="e.g. East Quad"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {addError && <p className="text-red-500 text-sm">{addError}</p>}

                <button
                  onClick={handleAddSchool}
                  disabled={adding || !newSchoolName.trim() || !newDormName.trim()}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {adding ? "Adding…" : "Add & Continue →"}
                </button>
              </div>
            )}

            {/* Step: dorm */}
            {step === "dorm" && selectedSchool && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">
                  Which dorm at{" "}
                  <span className="text-blue-600">{selectedSchool.name}</span>?
                </h3>

                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5 gap-2 focus-within:ring-2 focus-within:ring-blue-500 bg-white">
                  <Search className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    value={dormQuery}
                    onChange={(e) => setDormQuery(e.target.value)}
                    placeholder="Search dorms..."
                    className="flex-1 text-sm text-gray-900 outline-none placeholder-gray-400"
                    autoFocus
                  />
                </div>

                {dormsLoading ? (
                  <p className="text-xs text-gray-400 px-1">Loading dorms…</p>
                ) : filteredDorms.length > 0 ? (
                  <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm max-h-56 overflow-y-auto">
                    {filteredDorms.map((dorm) => (
                      <button
                        key={dorm.id}
                        onClick={() => {
                          setSelectedDorm(dorm);
                          setStep("review");
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0"
                      >
                        <div className="font-medium text-gray-900 text-sm">{dorm.name}</div>
                      </button>
                    ))}
                  </div>
                ) : (
                  !dormsLoading && (
                    <p className="text-sm text-gray-500 px-1">No dorms found.</p>
                  )
                )}
              </div>
            )}

            {/* Step: review */}
            {step === "review" && selectedDorm && (
              <ReviewForm
                dormId={selectedDorm.id}
                embedded={true}
                onSuccess={onClose}
                onClose={onClose}
              />
            )}

            {/* Back button */}
            {step !== "auth" && step !== "review" && (
              <button
                onClick={goBack}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mt-5 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sign-in overlay rendered above wizard (z-[60]) */}
      {showSignIn && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 px-4"
          style={{ zIndex: 60 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowSignIn(false);
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
            <button
              onClick={() => setShowSignIn(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Sign in to{" "}
              <span className="text-gray-900">Dorm</span>
              <span className="text-blue-600">Advisor</span>
            </h1>
            <SignInForm
              onSuccess={() => {
                setShowSignIn(false);
                if (pendingAddSchool) {
                  setPendingAddSchool(false);
                  setStep("add-school");
                } else {
                  setStep("school");
                }
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
