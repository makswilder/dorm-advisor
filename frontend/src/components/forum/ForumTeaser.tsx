"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { MessageSquare, ArrowRight } from "lucide-react";
import { getSystemThread } from "@/lib/api";

interface Props {
  schoolId: string;
  schoolName: string;
  schoolSlug: string;
}

function ThreadTeaser({
  schoolId,
  type,
  label,
  schoolSlug,
}: {
  schoolId: string;
  type: "BEST_DORMS" | "WORST_DORMS";
  label: string;
  schoolSlug: string;
}) {
  const { data: thread } = useQuery({
    queryKey: ["systemThread", schoolId, type],
    queryFn: () => getSystemThread(schoolId, type).then((r) => r.data),
  });

  return (
    <Link
      href={thread ? `/forum/${thread.id}` : "#"}
      className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group"
    >
      <div className="flex items-center gap-3">
        <MessageSquare className="w-5 h-5 text-blue-400 shrink-0" />
        <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
          {label} at {schoolSlug.replace(/-/g, " ")}
        </span>
      </div>
      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors shrink-0" />
    </Link>
  );
}

export function ForumTeaser({ schoolId, schoolName, schoolSlug }: Props) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-800">Housing Forum</h3>
      <p className="text-sm text-gray-500">See what students are saying about {schoolName} housing.</p>
      <ThreadTeaser schoolId={schoolId} type="BEST_DORMS" label="Best dorms" schoolSlug={schoolName} />
      <ThreadTeaser schoolId={schoolId} type="WORST_DORMS" label="Worst dorms" schoolSlug={schoolName} />
    </div>
  );
}
