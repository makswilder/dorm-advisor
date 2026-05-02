"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { updateProfile } from "@/lib/api";
import { Spinner } from "@/components/ui/Spinner";

const AVATAR_EMOJIS = [
  "🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯",
  "🦁","🐮","🐷","🐸","🐵","🦄","🐲","🦋","🐢","🐬",
  "🦅","🦉","🐺","🦝","🤖","👾","🎃","🌟","🍀","🦋",
  "😎","🤓","😇","🥳","🤩","😊","🧑‍🎓","👨‍💻","👩‍💻","🧠",
];

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const qc = useQueryClient();
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // initialise from user once loaded
  const [initialised, setInitialised] = useState(false);
  if (!initialised && user) {
    setName(user.displayName ?? "");
    setSelectedEmoji(user.avatarEmoji ?? null);
    setInitialised(true);
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Spinner className="w-8 h-8 text-blue-400" />
      </div>
    );
  }

  if (!user) {
    router.replace("/");
    return null;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await updateProfile({
        displayName: name,
        avatarEmoji: selectedEmoji ?? "",
      });
      qc.invalidateQueries({ queryKey: ["me"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-black text-gray-900 mb-1">My Profile</h1>
      <p className="text-sm text-gray-400 mb-8">{user.email}</p>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Display name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Display name <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
            placeholder="e.g. Alex"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Avatar emoji */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Avatar emoji <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <div className="grid grid-cols-10 gap-1.5">
            {AVATAR_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setSelectedEmoji(emoji === selectedEmoji ? null : emoji)}
                className={`text-2xl h-10 w-10 flex items-center justify-center rounded-xl transition-all ${
                  selectedEmoji === emoji
                    ? "bg-blue-100 ring-2 ring-blue-500 scale-110"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
          {selectedEmoji && (
            <p className="text-xs text-gray-400 mt-2">
              Selected: {selectedEmoji} —{" "}
              <button
                type="button"
                onClick={() => setSelectedEmoji(null)}
                className="text-red-400 hover:text-red-600 underline"
              >
                clear
              </button>
            </p>
          )}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-60"
        >
          {saving ? "Saving…" : saved ? "Saved ✓" : "Save profile"}
        </button>
      </form>
    </div>
  );
}
