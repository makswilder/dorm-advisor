"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageCircleQuestion, ChevronDown, ChevronUp } from "lucide-react";
import { getQuestionsForDorm, getAnswersForQuestion, createQuestion, createAnswer } from "@/lib/api";
import { AdminBadge } from "@/components/ui/Badge";
import type { DormQuestionDto } from "@/lib/types";

interface Props {
  dormId: string;
}

function AnswerThread({ question }: { question: DormQuestionDto }) {
  const [open, setOpen] = useState(false);
  const [answerText, setAnswerText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const qc = useQueryClient();

  const { data: answers } = useQuery({
    queryKey: ["answers", question.id],
    queryFn: () => getAnswersForQuestion(question.id).then((r) => r.data),
    enabled: open,
  });

  async function handleAnswerSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!answerText.trim()) return;
    setSubmitting(true);
    try {
      await createAnswer(question.id, { answerText });
      setAnswerText("");
      qc.invalidateQueries({ queryKey: ["answers", question.id] });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="border border-gray-100 rounded-lg">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <span className="text-left">{question.questionText}</span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3">
          {answers?.map((a) => (
            <div
              key={a.id}
              className={`pl-3 border-l-2 ${a.isAdmin ? "border-red-400 bg-red-50 rounded-r-lg pr-3 py-2" : "border-blue-200"}`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                {a.authorEmoji && (
                  <span className="text-base leading-none">{a.authorEmoji}</span>
                )}
                <span className="text-xs font-semibold text-gray-700">
                  {a.authorName ?? (a.authorType === "GUEST" ? "Guest" : "Member")}
                </span>
                <AdminBadge isAdmin={a.isAdmin} />
              </div>
              <p className="text-sm text-gray-700">{a.answerText}</p>
            </div>
          ))}
          {(!answers || answers.length === 0) && (
            <p className="text-xs text-gray-400">No answers yet. Be the first!</p>
          )}
          <form onSubmit={handleAnswerSubmit} className="flex gap-2 mt-2">
            <input
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Your answer..."
              minLength={5}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={submitting || !answerText.trim()}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-900 disabled:opacity-50"
              style={{ backgroundColor: "#facc15" }}
            >
              Answer
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export function QAWidget({ dormId }: Props) {
  const [questionText, setQuestionText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const qc = useQueryClient();

  const { data: questions, isLoading } = useQuery({
    queryKey: ["questions", dormId],
    queryFn: () => getQuestionsForDorm(dormId).then((r) => r.data),
  });

  async function handleQuestionSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!questionText.trim()) return;
    setSubmitting(true);
    try {
      await createQuestion(dormId, { questionText });
      setQuestionText("");
      qc.invalidateQueries({ queryKey: ["questions", dormId] });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <MessageCircleQuestion className="w-5 h-5 text-blue-500" />
        <h3 className="font-semibold text-gray-800">Questions &amp; Answers</h3>
      </div>

      {isLoading && <p className="text-sm text-gray-400">Loading…</p>}
      {questions?.map((q) => <AnswerThread key={q.id} question={q} />)}
      {!isLoading && !questions?.length && (
        <p className="text-sm text-gray-400">No questions yet.</p>
      )}

      <form onSubmit={handleQuestionSubmit} className="flex gap-2 pt-2">
        <input
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Ask a question about this dorm..."
          minLength={10}
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={submitting || !questionText.trim()}
          className="px-4 py-2 rounded-lg text-sm font-medium text-gray-900 disabled:opacity-50 shrink-0"
          style={{ backgroundColor: "#facc15" }}
        >
          Ask
        </button>
      </form>
    </div>
  );
}
