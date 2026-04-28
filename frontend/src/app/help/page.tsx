import { HelpCircle, Mail, ShieldCheck, Clock } from "lucide-react";

export const metadata = {
  title: "Help & FAQ — DormAdvisor",
};

const faqs = [
  {
    q: "How do I sign in?",
    a: "We use passwordless magic links. Enter your email address and we'll send you a one-click sign-in link. No password needed.",
  },
  {
    q: "I tried signing in but never received the sign-in link.",
    a: "Check your spam folder first. Magic links expire in 15 minutes and are single-use. If you still don't see it, try requesting a new one on the sign-in page. Make sure you used the correct email address.",
  },
  {
    q: "What is a Verified Student badge?",
    a: "If you sign in with a .edu email that matches a school registered on DormAdvisor, your reviews will show a Verified Student badge. This helps other students know the review came from someone who actually attended.",
  },
  {
    q: "Can I submit a review without creating an account?",
    a: "Yes! Guest reviews are welcome. However, reviews from guests won't have the Verified Student badge.",
  },
  {
    q: "How long does it take for my review to appear?",
    a: "All reviews go through a quick moderation check before being published. This typically takes a short time.",
  },
  {
    q: "How do I add a school or dorm that's missing?",
    a: "Sign in and look for the 'Add School' button on the All Schools page, or 'Add Dorm' on the school's dorm list page. New additions are reviewed before going live.",
  },
  {
    q: "How are dorm ratings calculated?",
    a: "The overall rating is the average of all submitted overall scores on a 1–5 scale. Sub-ratings (cleanliness, noise, location, etc.) are averages of the corresponding fields submitted by reviewers.",
  },
];

export default function HelpPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center gap-3 mb-8">
        <HelpCircle className="w-8 h-8 text-blue-500" />
        <h1 className="text-3xl font-black text-gray-900">Help &amp; FAQ</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-blue-50 rounded-xl p-5 text-center">
          <Mail className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-700">Magic Link Sign-In</p>
          <p className="text-xs text-gray-400 mt-1">No passwords, ever</p>
        </div>
        <div className="bg-green-50 rounded-xl p-5 text-center">
          <ShieldCheck className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-700">Verified Reviews</p>
          <p className="text-xs text-gray-400 mt-1">.edu email verification</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-5 text-center">
          <Clock className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-700">Links expire in 15 min</p>
          <p className="text-xs text-gray-400 mt-1">One-time use only</p>
        </div>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <details key={i} className="bg-white border border-gray-100 shadow-sm rounded-xl group">
            <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-medium text-gray-800 hover:text-blue-600 transition-colors list-none">
              {faq.q}
              <span className="text-gray-300 group-open:rotate-180 transition-transform">▾</span>
            </summary>
            <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">{faq.a}</div>
          </details>
        ))}
      </div>
    </div>
  );
}
