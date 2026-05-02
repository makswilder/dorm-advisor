"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllQuestions, getAllAnswers, removeQuestion, removeAnswer } from "@/lib/api";
import { Spinner } from "@/components/ui/Spinner";
import { Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function AdminQAPage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<"questions" | "answers">("questions");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const { data: questions, isLoading: qLoading } = useQuery({
    queryKey: ["admin", "questions", "all"],
    queryFn: () => getAllQuestions().then((r) => r.data),
  });

  const { data: answers, isLoading: aLoading } = useQuery({
    queryKey: ["admin", "answers", "all"],
    queryFn: () => getAllAnswers().then((r) => r.data),
  });

  async function handleRemoveQ(id: string) {
    await removeQuestion(id);
    setConfirmId(null);
    qc.invalidateQueries({ queryKey: ["admin", "questions", "all"] });
  }

  async function handleRemoveA(id: string) {
    await removeAnswer(id);
    setConfirmId(null);
    qc.invalidateQueries({ queryKey: ["admin", "answers", "all"] });
  }

  const isLoading = tab === "questions" ? qLoading : aLoading;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Live Q&amp;A</h2>
      <div className="flex gap-2 mb-6">
        {(["questions", "answers"] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setConfirmId(null); }}
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
          {!qLoading && !questions?.length && <p className="text-gray-400 text-sm">No questions yet.</p>}
          {questions?.map((q) => (
            <div key={q.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{q.questionText}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {q.authorEmail
                      ? <span className="text-blue-500">{q.authorEmail}</span>
                      : <span>Guest</span>}{" · "}
                    {formatDistanceToNow(new Date(q.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <button
                  onClick={() => setConfirmId(q.id)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
              {confirmId === q.id && (
                <div className="mt-3 flex items-center gap-2 bg-red-50 rounded-lg p-3">
                  <p className="text-sm text-red-700 flex-1">Remove this question and all its answers?</p>
                  <button
                    onClick={() => handleRemoveQ(q.id)}
                    className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setConfirmId(null)}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-white"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "answers" && (
        <div className="space-y-3">
          {!aLoading && !answers?.length && <p className="text-gray-400 text-sm">No answers yet.</p>}
          {answers?.map((a) => (
            <div key={a.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{a.answerText}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {a.authorEmail
                      ? <span className="text-blue-500">{a.authorEmail}</span>
                      : <span>Guest</span>}{" · "}
                    {formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <button
                  onClick={() => setConfirmId(a.id)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
              {confirmId === a.id && (
                <div className="mt-3 flex items-center gap-2 bg-red-50 rounded-lg p-3">
                  <p className="text-sm text-red-700 flex-1">Remove this answer? It will be hidden immediately.</p>
                  <button
                    onClick={() => handleRemoveA(a.id)}
                    className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setConfirmId(null)}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-white"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
