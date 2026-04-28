"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPendingDorms, approveDorm, rejectDorm } from "@/lib/api";
import { Spinner } from "@/components/ui/Spinner";
import { CheckCircle, XCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function AdminDormsPage() {
  const qc = useQueryClient();
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const { data: dorms, isLoading } = useQuery({
    queryKey: ["admin", "dorms"],
    queryFn: () => getPendingDorms().then((r) => r.data),
  });

  async function handleApprove(id: string) {
    await approveDorm(id, {});
    qc.invalidateQueries({ queryKey: ["admin", "dorms"] });
  }

  async function handleReject(id: string) {
    await rejectDorm(id, { reason: rejectReason || undefined });
    setRejectId(null);
    setRejectReason("");
    qc.invalidateQueries({ queryKey: ["admin", "dorms"] });
  }

  if (isLoading) return <div className="flex justify-center py-10"><Spinner className="w-6 h-6 text-blue-400" /></div>;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Pending Dorms ({dorms?.length ?? 0})</h2>
      {!dorms?.length && <p className="text-gray-400 text-sm">No pending dorms.</p>}
      <div className="space-y-3">
        {dorms?.map((dorm) => (
          <div key={dorm.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-900">{dorm.name}</h3>
                {dorm.categories.length > 0 && (
                  <p className="text-xs text-gray-400 mt-0.5">{dorm.categories.join(", ")}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {formatDistanceToNow(new Date(dorm.createdAt), { addSuffix: true })}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleApprove(dorm.id)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => setRejectId(dorm.id)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>
            {rejectId === dorm.id && (
              <div className="mt-3 flex gap-2">
                <input
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Reason (optional)"
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                />
                <button
                  onClick={() => handleReject(dorm.id)}
                  className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setRejectId(null)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
