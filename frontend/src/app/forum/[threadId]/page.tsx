"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Send, MessageSquare } from "lucide-react";
import { getForumThread, getForumPosts, createForumPost } from "@/lib/api";
import { Spinner } from "@/components/ui/Spinner";

export default function ForumThreadPage() {
  const { threadId } = useParams<{ threadId: string }>();
  const qc = useQueryClient();
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  const { data: thread, isLoading: threadLoading } = useQuery({
    queryKey: ["forumThread", threadId],
    queryFn: () => getForumThread(threadId).then((r) => r.data),
    enabled: !!threadId,
  });

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ["forumPosts", threadId],
    queryFn: () => getForumPosts(threadId).then((r) => r.data),
    enabled: !!threadId,
  });

  async function handlePost(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setError("");
    setPosting(true);
    try {
      await createForumPost(threadId, { postText: text.trim() });
      setText("");
      qc.invalidateQueries({ queryKey: ["forumPosts", threadId] });
    } catch {
      setError("Failed to post. Please try again.");
    } finally {
      setPosting(false);
    }
  }

  if (threadLoading || postsLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Spinner className="w-8 h-8 text-blue-400" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <MessageSquare className="w-6 h-6 text-blue-500 shrink-0" />
        <div>
          <h1 className="text-xl font-black text-gray-900">{thread?.title ?? "Forum"}</h1>
          {thread?.type && (
            <p className="text-xs text-gray-400 mt-0.5 capitalize">
              {thread.type.replace(/_/g, " ").toLowerCase()}
            </p>
          )}
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-4 mb-10">
        {!posts?.length && (
          <p className="text-gray-400 text-sm text-center py-8">
            No posts yet — be the first to share your thoughts.
          </p>
        )}
        {posts?.map((post) => (
          <div key={post.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{post.postText}</p>
            <p className="text-xs text-gray-400 mt-3">
              {post.authorType === "GUEST" ? "Guest" : "Member"} ·{" "}
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        ))}
      </div>

      {/* New post form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Add a reply</h2>
        <form onSubmit={handlePost} className="space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder="Share your experience or ask a question…"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={posting || !text.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {posting ? "Posting…" : "Post reply"}
          </button>
        </form>
      </div>
    </div>
  );
}
