"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPendingSchools, approveSchool, rejectSchool } from "@/lib/api";
import { Spinner } from "@/components/ui/Spinner";
import { CheckCircle, XCircle, MapPin } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function AdminSchoolsPage() {
  const qc = useQueryClient();
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const { data: schools, isLoading } = useQuery({
    queryKey: ["admin", "schools"],
    queryFn: () => getPendingSchools().then((r) => r.data),
  });

  async function handleApprove(id: string) {
    await approveSchool(id, {});
    qc.invalidateQueries({ queryKey: ["admin", "schools"] });
  }

  async function handleReject(id: string) {
    await rejectSchool(id, { reason: rejectReason || undefined });
    setRejectId(null);
    setRejectReason("");
    qc.invalidateQueries({ queryKey: ["admin", "schools"] });
  }

  if (isLoading) return <div className="flex justify-center py-10"><Spinner className="w-6 h-6 text-blue-400" /></div>;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Pending Schools ({schools?.length ?? 0})</h2>
      {!schools?.length && <p className="text-gray-400 text-sm">No pending schools.</p>}
      <div className="space-y-3">
        {schools?.map((school) => (
          <div key={school.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-900">{school.name}</h3>
                {(school.city || school.state) && (
                  <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {[school.city, school.state].filter(Boolean).join(", ")}
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {formatDistanceToNow(new Date(school.createdAt), { addSuffix: true })}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleApprove(school.id)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => setRejectId(school.id)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>
            {rejectId === school.id && (
              <div className="mt-3 flex gap-2">
                <input
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Reason (optional)"
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                />
                <button
                  onClick={() => handleReject(school.id)}
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
