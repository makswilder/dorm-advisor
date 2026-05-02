import { ShieldCheck, ShieldAlert } from "lucide-react";

interface VerifiedProps {
  verified: boolean;
}

export function VerifiedBadge({ verified }: VerifiedProps) {
  if (!verified) return null;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-full px-2 py-0.5">
      <ShieldCheck className="w-3 h-3" />
      Verified Student
    </span>
  );
}

interface AdminProps {
  isAdmin: boolean;
}

export function AdminBadge({ isAdmin }: AdminProps) {
  if (!isAdmin) return null;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-full px-2 py-0.5">
      <ShieldAlert className="w-3 h-3" />
      Admin
    </span>
  );
}
