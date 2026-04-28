"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPendingQuestions,
  approveQuestion,
  rejectQuestion,
  getPendingAnswers,
  approveAnswer,
  rejectAnswer,
} from "@/lib/api";
import { Spinner } from "@/components/ui/Spinner";
import { CheckCircle, XCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function AdminQAPage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<"questions" | "answers">("questions");

  const { data: questions, isLoading: qLoading } = useQuery({
    queryKey: ["admin", "questions"],
    queryFn: () => getPendingQuestions().then((r) => r.data),
  });

  const { data: answers, isLoading: aLoading } = useQuery({
    queryKey: ["admin", "answers"],
    queryFn: () => getPendingAnswers().then((r) => r.data),
  });

  async function handleApproveQ(id: string) {
    await approveQuestion(id);
    qc.invalidateQueries({ queryKey: ["admin", "questions"] });
  }
  async function handleRejectQ(id: string) {
    await rejectQuestion(id);
    qc.invalidateQueries({ queryKey: ["admin", "questions"] });
  }
  async function handleApproveA(id: string) {
    await approveAnswer(id);
    qc.invalidateQueries({ queryKey: ["admin", "answers"] });
  }
  async function handleRejectA(id: string) {
    await rejectAnswer(id);
    qc.invalidateQueries({ queryKey: ["admin", "answers"] });
  }

  const isLoading = tab === "questions" ? qLoading : aLoading;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Pending Q&amp;A</h2>
      <div className="flex gap-2 mb-6">
        {(["questions", "answers"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              tab === t ? "text-gray-900" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
            style={tab === t ? { backgroundColor: "#facc15" } : {}}
          >
            {t} ({t === "questions" ? (questions?.length ?? 0) : (answers?.length ?? 0)})
          </button>
        ))}
      </div>

      {isLoading && <div className="flex justify-center py-6"><Spinner className="w-6 h-6 text-blue-400" /></div>}

      {tab === "questions" && (
        <div className="space-y-3">
          {!qLoading && !questions?.length && <p className="text-gray-400 text-sm">No pending questions.</p>}
          {questions?.map((q) => (
            <div key={q.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{q.questionText}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {formatDistanceToNow(new Date(q.createdAt), { addSuffix: true })}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => handleApproveQ(q.id)} className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100">
                  <CheckCircle className="w-4 h-4" />
                </button>
                <button onClick={() => handleRejectQ(q.id)} className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100">
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "answers" && (
        <div className="space-y-3">
          {!aLoading && !answers?.length && <p className="text-gray-400 text-sm">No pending answers.</p>}
          {answers?.map((a) => (
            <div key={a.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{a.answerText}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {a.authorType} · {formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => handleApproveA(a.id)} className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100">
                  <CheckCircle className="w-4 h-4" />
                </button>
                <button onClick={() => handleRejectA(a.id)} className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100">
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
