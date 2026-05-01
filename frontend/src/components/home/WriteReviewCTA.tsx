"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { WriteReviewWizard } from "@/components/review/WriteReviewWizard";

export function WriteReviewCTA() {
  const [showWizard, setShowWizard] = useState(false);
  return (
    <>
      <button
        onClick={() => setShowWizard(true)}
        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        Write a Review
        <ArrowRight className="w-4 h-4" />
      </button>
      {showWizard && <WriteReviewWizard onClose={() => setShowWizard(false)} />}
    </>
  );
}
