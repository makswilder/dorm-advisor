import { ShieldCheck } from "lucide-react";

interface Props {
  verified: boolean;
}

export function VerifiedBadge({ verified }: Props) {
  if (!verified) return null;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-full px-2 py-0.5">
      <ShieldCheck className="w-3 h-3" />
      Verified Student
    </span>
  );
}
